import io

import numpy as np
from PIL import Image, ImageDraw
from backend.emotion.schemas import EmotionClassificationResponse

class FakeEmotionModel:
    
    """Returns a canned classification and rememebers the batch it got"""
    
    def __init__(self, label: str = "happy", confidence_percent: int = 87,
                 raises: Exception | None = None):
        self._response = EmotionClassificationResponse(label=label, confidencePercent=confidence_percent)
        self._raises = raises
        self.received_batch: np.ndarray | None = None

    def predict(self, batch: np.ndarray) -> EmotionClassificationResponse:
        self.received_batch = batch
        if self._raises is not None:
            raise self._raises
        return self._response

    
class FakeFaceDetector:
    """Returns whatever boxes the test chooses."""
    
    def __init__(self, boxes: list[tuple[int,int,int,int]]):
        self._boxes = boxes
    
    def detect(self, gray: np.ndarray) -> list[tuple[int,int,int,int]]:
        return self._boxes
    
def png_bytes(width: int = 200, height: int = 200, color=(120,80,40)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (width,height), color).save(buf,"PNG")
    return buf.getvalue()


def two_tone_png(width: int = 300, height: int = 200, split_x: int = 150,
                 left: int = 30, right: int = 220) -> bytes:
    """Grayscale image: dark left of split_x, bright right of it."""
    img = Image.new("L", (width, height), left)
    ImageDraw.Draw(img).rectangle([split_x, 0, width - 1, height - 1], fill=right)
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return buf.getvalue()