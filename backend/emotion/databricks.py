from collections.abc import Callable

import numpy as np
from databricks.sdk import WorkspaceClient

from backend.emotion.model import EmotionModelCallFailed, EmotionModelUnavailable
from backend.emotion.schemas import EmotionClassificationResponse


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

class DatabricksEmotionModel:
    ENDPOINT_NAME = "emotional-identifier"
    
    def __init__(self, client_factory: Callable[[],WorkspaceClient]) -> None:
        self._client_factory = client_factory
        self._client: WorkspaceClient | None = None
    
    def _get_client(self) -> WorkspaceClient:
        if self._client is None:
            self._client = self._client_factory()
        return self._client
    
    def predict(self,batch:np.ndarray) -> EmotionClassificationResponse: 
        try:
            client = self._get_client()
        except KeyError as exc:
            raise EmotionModelUnavailable(f"Missing Databricks setting: {exc}") from exc
        
        try: 
            result = client.serving_endpoints.query(
                name=self.ENDPOINT_NAME, inputs=batch.tolist()
            )
        except Exception as exc:
            raise EmotionModelCallFailed("Emotion model call failed") from exc
        
        return EmotionClassificationResponse(**normalize_prediction(result.as_dict()))
