"""Emotion classification: image bytes in, emotion label and confidence out.

Everything about preparing an image for the emotion model lives here.
The router owns HTTP concerns; this module starts at accepted bytes.
"""
import io
import cv2
import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

from backend.emotion.face_detector import Box, FaceDetector
from backend.emotion.model import EmotionModel
from backend.emotion.schemas import EmotionClassificationResponse

class UnreadableImage(Exception):
    """The bytes are not an image PIL can open."""

class NoFaceDetected(Exception):
    """The face detector found no face in the image"""

def classify_emotion(contents: bytes, model: EmotionModel, detector: FaceDetector) -> EmotionClassificationResponse:
    
    gray = _decode_grayscale(contents)
    face = _crop_face(gray, detector.detect(gray))
    if face is None:
        raise NoFaceDetected
    return model.predict(_prepare_batch(face))

def _decode_grayscale(contents: bytes) -> np.ndarray:
    # Image.open only reads the header; a file cut off mid-upload fails later,
    # during decoding, with OSError. Both mean the visitor sent a bad file.
    try:
        image = Image.open(io.BytesIO(contents))
        image = ImageOps.exif_transpose(image)  # phone uploads are often rotated
        return np.array(image.convert("L"))
    except (UnidentifiedImageError, OSError) as exc:
        raise UnreadableImage() from exc

def _crop_face(gray: np.ndarray, boxes: list[Box]) -> np.ndarray | None:
    
    if not boxes:
        return None
    
    x,y,w,h = max(boxes, key=lambda f: f[2] * f[3])
    
    pad = int(0.15 * w)  # a little margin, FER crops include some forehead/chin
    x0, y0 = max(x - pad, 0), max(y - pad, 0)
    x1, y1 = min(x + w + pad, gray.shape[1]), min(y + h + pad, gray.shape[0])
    return gray[y0:y1, x0:x1]

def _prepare_batch(face: np.ndarray) -> np.ndarray:
    face = cv2.equalizeHist(face)  # evens out lighting
    face = cv2.resize(face, (48, 48), interpolation=cv2.INTER_AREA)  # FER2013 input size
    # The emotion model expects raw 0-255 float pixel values and scales
    # internally. Never divide by 255 here.
    stacked = np.stack([face] * 3, axis=-1).astype(np.float32)  # (48, 48, 3)
    return np.expand_dims(stacked, axis=0) 