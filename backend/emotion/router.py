"""HTTP layer for emotion classification.

Owns content type, size limits and the rate limit, and maps emotion
classification outcomes to status codes. Both seams are FastAPI
dependencies so tests can override them with fakes.
"""

import logging
import os

from databricks.sdk import WorkspaceClient
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from backend.emotion.databricks import DatabricksEmotionModel
from backend.emotion.face_detector import FaceDetector, OpenCvFaceDetector
from backend.emotion.model import EmotionModel, EmotionModelCallFailed, EmotionModelUnavailable
from backend.emotion.schemas import EmotionClassificationResponse
from backend.emotion.service import NoFaceDetected, UnreadableImage, classify_emotion
from backend.ratelimit import limiter

logger = logging.getLogger(__name__)

router = APIRouter(tags=["emotion"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

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


@router.post("/api/emotion_classification")        
@limiter.limit("10/minute")
async def post_emotion_classification(
    request: Request,
    file: UploadFile = File(...),
    model: EmotionModel = Depends(_emotion_model_dep),
    detector: FaceDetector = Depends(_face_detector_dep),
) -> EmotionClassificationResponse:                 

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

        return classify_emotion(contents, model, detector)

    except HTTPException:
        raise
    except UnreadableImage:
        raise HTTPException(status_code=400, detail="File is not a readable image, try a different JPEG, PNG or WebP")
    except NoFaceDetected:
        raise HTTPException(status_code=422, detail="No face detected, try facing the camera with good lighting")
    except EmotionModelUnavailable as exc:
        logger.warning("Emotion model not configured: %s", exc)
        raise HTTPException(status_code=503, detail="Emotion model is not configured right now")
    except EmotionModelCallFailed:
        logger.exception("Emotion model call failed")
        raise HTTPException(status_code=502, detail="Emotion model is temporarily unavailable, try again shortly")
    except Exception:
        logger.exception("Error in emotion classification")
        raise HTTPException(status_code=500, detail="Internal error processing image")
