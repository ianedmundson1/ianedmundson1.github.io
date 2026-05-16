import os
import logging
import io
from pathlib import Path
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from PIL import Image
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.responses import FileResponse
from databricks.sdk import WorkspaceClient
from databricks.sdk.service.serving import DataframeSplitInput
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from starlette.responses import JSONResponse
import sentry_sdk

# Each tier has independent dev/test/prod envs. APP_ENV selects which
# backend/.env.<env> file to layer on top of the process environment. Values
# already in os.environ win (so Docker/CI overrides are not clobbered).
APP_ENV = os.environ.get("APP_ENV", "development")
_env_file = Path(__file__).parent / f".env.{APP_ENV}"
if _env_file.is_file():
    load_dotenv(_env_file, override=False)

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

# Rate limiter protects the paid Databricks endpoint from abuse. The default
# limit applies globally; per-route decorators tighten further (see emotion).
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(_request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=429, content={"detail": f"Rate limit exceeded: {exc.detail}"})

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
EMOTION_ENDPOINT_NAME = "emotional-identifier"

_workspace_client: WorkspaceClient | None = None


def get_workspace_client() -> WorkspaceClient:
    global _workspace_client
    if _workspace_client is None:
        _workspace_client = WorkspaceClient(
            host=os.environ["DATABRICKS_HOST"],
            token=os.environ["DATABRICKS_TOKEN"],
        )
    return _workspace_client


def score_model(dataset):
    client = get_workspace_client()

    if isinstance(dataset, pd.DataFrame):
        split = dataset.to_dict(orient='split')
        dataframe_split = DataframeSplitInput(
            columns=split.get('columns'),
            data=split.get('data'),
            index=split.get('index'),
        )
        result = client.serving_endpoints.query(name=EMOTION_ENDPOINT_NAME, dataframe_split=dataframe_split)
    else:
        inputs = dataset.tolist()
        result = client.serving_endpoints.query(name=EMOTION_ENDPOINT_NAME, inputs=inputs)

    return result.as_dict()


def normalize_prediction(raw: dict) -> dict:
    payload = raw.get("predictions", raw.get("outputs", raw))
    record = payload[0] if isinstance(payload, list) and payload else payload
    if not isinstance(record, dict):
        record = {}

    label = record.get("label") or record.get("emotion") or record.get("prediction") or "Unknown"

    score = record.get("score")
    if score is None:
        score = record.get("confidence")
    if score is None:
        score = record.get("probability")
    if score is None:
        score = 0

    try:
        score = float(score)
    except (TypeError, ValueError):
        score = 0.0

    confidence_percent = round(score * 100) if score <= 1 else round(score)
    return {"label": label, "confidencePercent": confidence_percent}


@app.get("/api/hello")
async def hello():
    logger.info("Accessed /api/hello")
    return {"message": "Hello from FastAPI!"}


@app.get("/api/health")
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
async def post_emotion_classification(request: Request, file: UploadFile = File(...)):
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

        image = Image.open(io.BytesIO(contents))

        # Resize to 48x48 (FER2013 input size).
        target_size = (48, 48)
        image = image.resize(target_size)
        image = image.convert('RGB')

        # The Databricks emotion model expects raw 0-255 float pixel values
        # and performs any needed scaling internally, so do NOT normalize here.
        img_array = np.array(image).astype(np.float32)
        input_data = np.expand_dims(img_array, axis=0)

        logger.info(f"Calling Databricks model with shape: {input_data.shape}")
        result = score_model(input_data)

        return normalize_prediction(result)

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error in emotion classification")
        raise HTTPException(status_code=500, detail="Internal error processing image")


static_dir = os.path.realpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "static"))
os.makedirs(static_dir, exist_ok=True)


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


@app.get("/api/resume")
async def get_resume():
    
    resume_name = "resume_ian_edmundson.pdf"
    
    file_path = os.path.join(static_dir, resume_name)
    
    if os.path.isfile(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=resume_name)

    raise HTTPException(
        status_code=404,
        detail="Resume not found."
    )
    