import pytest
from fastapi.testclient import TestClient
import numpy as np
from backend.main import app, limiter, _emotion_model_dep, _face_detector_dep, EmotionModelCallFailed, EmotionModelUnavailable
from tests.emotion_fakes import FakeEmotionModel, FakeFaceDetector, png_bytes, two_tone_png

URL = "/api/emotion_classification"
ONE_FACE = [(50, 50, 80, 80)]


@pytest.fixture(autouse=True)
def _clean_state():
    limiter.reset()
    yield
    app.dependency_overrides.clear()


def _client(model: FakeEmotionModel, detector: FakeFaceDetector) -> TestClient:
    app.dependency_overrides[_emotion_model_dep] = lambda: model
    app.dependency_overrides[_face_detector_dep] = lambda: detector
    return TestClient(app)


def _upload(client: TestClient, data: bytes, content_type: str = "image/png"):
    return client.post(URL, files={"file": ("face.png", data, content_type)})

@pytest.mark.parametrize(
    ("error", "expected_status"),
    [
        (EmotionModelUnavailable("DATABRICKS_HOST missing"), 503),
        (EmotionModelCallFailed("upstream timed out"), 502),
    ],
)
def test_emotion_model_failures_map_to_distinct_status_codes(error, expected_status):
    client = _client(FakeEmotionModel(raises=error), FakeFaceDetector(ONE_FACE))

    response = _upload(client, png_bytes())

    assert response.status_code == expected_status
    assert "DATABRICKS_HOST" not in response.json()["detail"]


def test_success_returns_the_emotion_models_label_and_confidence():
    client = _client(FakeEmotionModel("surprise", 64), FakeFaceDetector(ONE_FACE))

    response = _upload(client, png_bytes())

    assert response.status_code == 200
    assert response.json() == {"label": "surprise", "confidencePercent": 64}

def test_emotion_model_receives_one_48x48_three_channel_batch_of_raw_pixel_values():
    model = FakeEmotionModel()
    client = _client(model, FakeFaceDetector(ONE_FACE))

    _upload(client, png_bytes())

    batch = model.received_batch
    assert batch.shape == (1, 48, 48, 3)
    assert batch.dtype == np.float32
    # Raw 0-255 values: the emotion model scales internally. Never divide by 255.
    assert batch.max() > 1
    assert batch.min() >= 0 and batch.max() <= 255
    # Grayscale stacked to three identical channels
    assert (batch[..., 0] == batch[..., 1]).all()
    assert (batch[..., 1] == batch[..., 2]).all()

def test_largest_detected_face_is_the_one_classified():
    small_dark = (10, 10, 30, 30)
    largest_bright = (170, 40, 110, 110)
    medium_dark = (60, 100, 60, 60)
    model = FakeEmotionModel()
    client = _client(model, FakeFaceDetector([small_dark, largest_bright, medium_dark]))

    _upload(client, two_tone_png())

    # Every pixel came from the bright half, so the largest box was cropped.
    assert (model.received_batch == 220).all()

def test_bytes_that_are_not_an_image_return_400():
    client = _client(FakeEmotionModel(), FakeFaceDetector(ONE_FACE))

    response = _upload(client, b"definitely not an image", content_type="image/png")

    assert response.status_code == 400
    assert "image" in response.json()["detail"].lower()

