from types import SimpleNamespace

import numpy as np
import pytest

from backend.emotion.databricks import DatabricksEmotionModel
from backend.emotion.model import EmotionModelUnavailable


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


def test_predict_turns_a_non_string_emotion_label_into_a_string():
    stub = StubWorkspaceClient({"predictions": [{"prediction": 3, "probability": 0.5}]})
    model = DatabricksEmotionModel(lambda: stub)

    result = model.predict(np.zeros((1, 2, 2, 3), dtype=np.float32))

    assert result.label == "3"
    assert result.confidencePercent == 50


def _factory_raising(exc: Exception):
    def factory():
        raise exc
    return factory


@pytest.mark.parametrize(
    "config_error",
    [
        KeyError("DATABRICKS_HOST"),  # env var absent
        ValueError("default auth: cannot configure default credentials"),  # set but blank
    ],
)
def test_predict_reports_unavailable_when_the_client_cannot_be_configured(config_error):
    model = DatabricksEmotionModel(_factory_raising(config_error))

    with pytest.raises(EmotionModelUnavailable):
        model.predict(np.zeros((1, 2, 2, 3), dtype=np.float32))
