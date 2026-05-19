import os
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient
from backend.main import app, limiter, normalize_prediction

client = TestClient(app)


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    # slowapi keeps state across requests; clear between tests so one test's
    # bucket doesn't leak into another.
    limiter.reset()
    yield


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_ready_check_without_credentials(monkeypatch):
    monkeypatch.delenv("DATABRICKS_HOST", raising=False)
    monkeypatch.delenv("DATABRICKS_TOKEN", raising=False)
    response = client.get("/api/ready")
    assert response.status_code == 503


def test_ready_check_with_credentials(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://example.databricks.com")
    monkeypatch.setenv("DATABRICKS_TOKEN", "fake-token")
    response = client.get("/api/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_emotion_rate_limited():
    # 11th call within the 10/minute window should be rejected before reaching
    # the Databricks-backed handler.
    for _ in range(10):
        client.post(
            "/api/emotion_classification",
            files={"file": ("a.txt", b"x", "text/plain")},
        )
    response = client.post(
        "/api/emotion_classification",
        files={"file": ("a.txt", b"x", "text/plain")},
    )
    assert response.status_code == 429


def test_hello():
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI!"}


def test_emotion_classification_no_file():
    response = client.post("/api/emotion_classification")
    assert response.status_code == 422  # Unprocessable Entity, file is required


def test_serve_react_rejects_path_traversal():
    # The catch-all must not resolve "../" out of backend/static/. Without the
    # path check it would happily serve /etc/passwd or pyproject.toml.
    response = client.get("/../pyproject.toml")
    assert response.status_code in (404, 200)
    if response.status_code == 200:
        # If it 200s it must be the SPA fallback (index.html), never the source file.
        assert b"[project]" not in response.content


# --- normalize_prediction --------------------------------------------------

def test_normalize_prediction_predictions_list():
    raw = {"predictions": [{"label": "happy", "score": 0.87}]}
    assert normalize_prediction(raw) == {"label": "happy", "confidencePercent": 87}


def test_normalize_prediction_outputs_key():
    raw = {"outputs": [{"emotion": "sad", "confidence": 0.42}]}
    assert normalize_prediction(raw) == {"label": "sad", "confidencePercent": 42}


def test_normalize_prediction_score_already_percent():
    # Some endpoints return scores already on a 0-100 scale; pass them through.
    raw = {"predictions": [{"label": "angry", "score": 73}]}
    assert normalize_prediction(raw) == {"label": "angry", "confidencePercent": 73}


def test_normalize_prediction_probability_fallback():
    raw = {"predictions": [{"prediction": "neutral", "probability": 0.5}]}
    assert normalize_prediction(raw) == {"label": "neutral", "confidencePercent": 50}


def test_normalize_prediction_missing_fields():
    assert normalize_prediction({}) == {"label": "Unknown", "confidencePercent": 0}


def test_normalize_prediction_non_numeric_score():
    raw = {"predictions": [{"label": "happy", "score": "not-a-number"}]}
    assert normalize_prediction(raw) == {"label": "happy", "confidencePercent": 0}


# --- /api/contact -------------------------------------------------------------

CONTACT_PAYLOAD = {"name": "Test User", "email": "test@example.com", "message": "Hello"}


@pytest.fixture
def mock_send_message():
    with patch("backend.main.FastMail.send_message", new_callable=AsyncMock) as mock:
        yield mock


def test_contact_success(monkeypatch, mock_send_message):
    monkeypatch.setenv("MAIL_TO", "recipient@example.com")
    response = client.post("/api/contact", json=CONTACT_PAYLOAD)
    assert response.status_code == 200
    assert response.json() == {"status": "success"}
    mock_send_message.assert_called_once()


def test_contact_missing_mail_to(monkeypatch, mock_send_message):
    monkeypatch.delenv("MAIL_TO", raising=False)
    response = client.post("/api/contact", json=CONTACT_PAYLOAD)
    assert response.status_code == 500
    assert response.json()["detail"] == "Failed to send message"
    mock_send_message.assert_not_called()


def test_contact_missing_fields():
    response = client.post("/api/contact", json={"name": "Test User"})
    assert response.status_code == 422
