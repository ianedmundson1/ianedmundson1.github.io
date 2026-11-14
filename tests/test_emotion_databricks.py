from types import SimpleNamespace

import numpy as np

from backend.emotion.databricks import DatabricksEmotionModel


class StubServingEndpoints:
    def __init__(self, response: dict):
        self._response = response
        self.calls: list[dict] = []

    def query(self, **kwargs):
        self.calls.append(kwargs)
        return SimpleNamespace(as_dict=lambda: self._response)


class StubWorkspaceClient:
    def __init__(self, response: dict):
        self.serving_endpoints = StubServingEndpoints(response)


def test_predict_sends_the_batch_as_inputs_and_decodes_the_emotion_label():
    stub = StubWorkspaceClient({"predictions": [{"label": "sad", "score": 0.42}]})
    model = DatabricksEmotionModel(lambda: stub)
    batch = np.full((1, 2, 2, 3), 87.0, dtype=np.float32)

    result = model.predict(batch)

    assert stub.serving_endpoints.calls == [
        {"name": "emotional-identifier", "inputs": batch.tolist()}
    ]
    assert result.label == "sad"
    assert result.confidencePercent == 42
