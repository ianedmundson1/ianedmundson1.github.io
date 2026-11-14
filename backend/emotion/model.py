from typing import Protocol

import numpy as np

from backend.emotion.schemas import EmotionClassificationResponse

class EmotionModel(Protocol):
    def predict(self, batch:np.ndarray) -> EmotionClassificationResponse: ...
        
class EmotionModelUnavailable(Exception):...
    
class EmotionModelCallFailed(Exception): ...
    