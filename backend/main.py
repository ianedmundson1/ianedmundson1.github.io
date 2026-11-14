from dotenv import load_dotenv
import os
import logging
import io
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile, File 
from fastapi.responses import FileResponse
from databricks.sdk import WorkspaceClient
from pydantic import EmailStr, NameEmail, SecretStr, BaseModel
from typing import Protocol
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
import sentry_sdk
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import cv2
from collections.abc import Callable
from backend.analytics.router import router as analytics_router


# Each tier has independent dev/test/prod envs. APP_ENV selects which
# backend/.env.<env> file to layer on top of the process environment. Values
# already in os.environ win (so Docker/CI overrides are not clobbered).
APP_ENV = os.environ.get("APP_ENV", "development")
_env_file = Path(__file__).parent / f".env.{APP_ENV}"
if _env_file.is_file():
    load_dotenv(_env_file, override=False)
    
# Imported after load_dotenv: ratelimit reads TRUSTED_CLIENT_IP_HEADER at import time.
from backend.ratelimit import limiter
from backend.emotion.databricks import DatabricksEmotionModel, normalize_prediction
from backend.emotion.face_detector import Box, FaceDetector, OpenCvFaceDetector
from backend.emotion.model import EmotionModel, EmotionModelCallFailed, EmotionModelUnavailable
from backend.emotion.schemas import EmotionClassificationResponse

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", ""),
    traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0")),
    profiles_sample_rate=float(os.environ.get("SENTRY_PROFILES_SAMPLE_RATE", "0")),
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Simple FastAPI + React App")


app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.include_router(analytics_router)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(_request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": f"Rate limit exceeded: {exc.detail}"})

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

def crop_face(gray: np.ndarray, boxes: list[Box]) -> np.ndarray | None:
    
    if not boxes:
        return None
    
    x,y,w,h = max(boxes, key=lambda f: f[2] * f[3])
    
    pad = int(0.15 * w)  # a little margin, FER crops include some forehead/chin
    x0, y0 = max(x - pad, 0), max(y - pad, 0)
    x1, y1 = min(x + w + pad, gray.shape[1]), min(y + h + pad, gray.shape[0])
    return gray[y0:y1, x0:x1]


_emotion_model = DatabricksEmotionModel(
    lambda: WorkspaceClient(
        host=os.environ["DATABRICKS_HOST"],
        token=os.environ["DATABRICKS_TOKEN"]
    )
)

_face_detector = OpenCvFaceDetector()

def _emotion_model_dep() -> EmotionModel:
    return _emotion_model

def _face_detector_dep() -> FaceDetector:
    return _face_detector
    

@app.get("/api/hello")
async def hello():
    logger.info("Accessed /api/hello")
    return {"message": "Hello from FastAPI!"}


@app.get("/api/health")
@limiter.exempt
async def health_check():
    return {"status": "healthy"}


@app.get("/api/ready")
async def readiness_check():
    # Liveness vs. readiness: this confirms the Databricks credentials are
    # configured so traffic-routing systems can hold back from the pod until
    # an actual call to the model would have a chance of succeeding. We do
    # NOT call the model here, that would burn paid quota on every probe.
    host = os.environ.get("DATABRICKS_HOST")
    token = os.environ.get("DATABRICKS_TOKEN")
    if not host or not token:
        raise HTTPException(status_code=503, detail="Databricks credentials not configured")
    return {"status": "ready"}


@app.post("/api/emotion_classification")
@limiter.limit("10/minute")
async def post_emotion_classification(request: Request, 
                                      file: UploadFile = File(...),
                                      model: EmotionModel = Depends(_emotion_model_dep),
                                      detector: FaceDetector = Depends(_face_detector_dep)):
    logger.info("Processing emotion classification request")
    try:
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=415, detail=f"Unsupported file type '{file.content_type}'. Allowed: JPEG, PNG, WebP")

        # Reject oversized uploads before buffering them. Trust Content-Length
        # if present, then enforce again after read in case the header lied.
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid Content-Length header")

        contents = await file.read(MAX_UPLOAD_BYTES + 1)
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")

        try:
            image = Image.open(io.BytesIO(contents))
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="File is not a readable image, try a different JPEG, PNG or WebP")
        
        image = ImageOps.exif_transpose(image)
        gray = np.array(image.convert("L"))
        
        boxes = detector.detect(gray)
        
        face = crop_face(gray, boxes)
        
        if face is None:
            raise HTTPException(status_code=422, detail="No face detected, try facing the camera with good lighting")

        face = cv2.equalizeHist(face)                  # optional: evens out lighting
        # Resize to 48x48 (FER2013 input size).
        face = cv2.resize(face, (48, 48), interpolation=cv2.INTER_AREA)
        
        # The Databricks emotion model expects raw 0-255 float pixel values
        # and performs any needed scaling internally, so do NOT normalize here.
        img_array = np.stack([face] * 3, axis=-1).astype(np.float32)  # (48, 48, 3), still raw 0-255
        input_data = np.expand_dims(img_array, axis=0)


        logger.info("Calling emotion model with shape: %s", input_data.shape)


        return model.predict(input_data)

    except HTTPException:
        raise
    except EmotionModelUnavailable as exc:
        logger.warning("Emotion model not configured: %s", exc)
        raise HTTPException(status_code=503, detail="Emotion model is not configured right now")
    except EmotionModelCallFailed:
        logger.exception("Emotion model call failed")
        raise HTTPException(status_code=502, detail="Emotion model is temporarily unavailable, try again shortly")
    except Exception:
        logger.exception("Error in emotion classification")
        raise HTTPException(status_code=500, detail="Internal error processing image")


class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    message: str

@app.post("/api/contact")
@limiter.limit("5/minute")
async def contact(request: Request, payload: ContactPayload) -> dict[str, str]:
    
    try: 
        mail_config = ConnectionConfig(
            MAIL_USERNAME=os.environ["MAIL_USERNAME"],
            MAIL_PASSWORD=SecretStr(os.environ["MAIL_PASSWORD"]),
            MAIL_FROM=os.environ["MAIL_FROM"],
            MAIL_PORT=int(os.environ.get("MAIL_PORT", "587")),
            MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtp.office365.com"),
            MAIL_STARTTLS=True,
            MAIL_SSL_TLS=False,
        )
        
        message = MessageSchema(
            subject=f"Portfolio contact from {payload.name}",
            recipients=[NameEmail(name=payload.name, email=os.environ["MAIL_TO"])],
            reply_to=[NameEmail(name=payload.name, email=payload.email)],
            body=f"From: {payload.name} <{payload.email}>\n\n{payload.message}",
            subtype=MessageType.plain,
        )
        await FastMail(mail_config).send_message(message)
    except Exception:
        logger.exception("Error sending contact email")
        raise HTTPException(status_code=500, detail="Failed to send message")
    return {"status": "success"}

static_dir = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "static"))
os.makedirs(static_dir, exist_ok=True)

assets_dir = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets"))

@app.get("/api/resume")
async def get_resume():
    file_path = os.path.join(assets_dir, "resume_ian_edmundson.pdf")
    if os.path.isfile(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename="resume_ian_edmundson.pdf")
    raise HTTPException(status_code=404, detail="Resume not found.")

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    # Try to serve the actual file (css, js, images, favicon), with a path
    # check to prevent traversal out of static_dir via "../" segments.
    if full_path:
        candidate = os.path.realpath(os.path.join(static_dir, full_path))
        if (candidate == static_dir or candidate.startswith(static_dir + os.sep)) \
                and os.path.isfile(candidate):
            return FileResponse(candidate)

    # SPA fallback: serve index.html for unknown paths so /projects, etc. work.
    index_html = os.path.join(static_dir, "index.html")
    if os.path.isfile(index_html):
        logger.info(f"Serving React frontend for path: /{full_path}")
        return FileResponse(index_html)

    logger.error("Frontend not built. index.html missing.")
    raise HTTPException(
        status_code=404,
        detail="Frontend not built. Please run 'npm run build' first."
    )