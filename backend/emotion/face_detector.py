
from typing import Protocol

import cv2
import numpy as np

_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

Box = tuple[int, int, int, int]

class FaceDetector(Protocol):
    def detect(self, gray: np.ndarray) -> list[Box]: ...
    
class OpenCvFaceDetector:
    
    def __init__(self, cascade_path: str = _CASCADE_PATH) -> None:
        self._cascade = cv2.CascadeClassifier(cascade_path)
        if self._cascade.empty():
            raise RuntimeError(f"Face cascade failed to load from {cascade_path}")
                
    def detect(self,gray:np.ndarray) -> list[Box]:
        faces = self._cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
        return [tuple(int(v) for v in f) for f in faces]