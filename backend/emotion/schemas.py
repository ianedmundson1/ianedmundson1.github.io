from pydantic import BaseModel

class EmotionClassificationResponse(BaseModel):
    label: str
    confidencePercent: int