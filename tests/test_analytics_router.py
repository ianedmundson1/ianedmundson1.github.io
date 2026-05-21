from typing import Any, Mapping

import pytest
from fastapi.testclient import TestClient

from backend.analytics import service
from backend.analytics.router import _datasource_dep
from backend.main import app


class FakeDataSource:
    def __init__(self, rows: list[dict[str, Any]]):
        self.rows = rows

    def execute(self, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
        return self.rows


@pytest.fixture(autouse=True)
def _table_env(monkeypatch):
    monkeypatch.setenv("SEATTLE_FIRE_911_TABLE", "cat.schema.fire_911")
    service.clear_caches()
    yield
    service.clear_caches()
    app.dependency_overrides.clear()


def _client_with(rows: list[dict[str, Any]]) -> TestClient:
    app.dependency_overrides[_datasource_dep] = lambda: FakeDataSource(rows)
    return TestClient(app)


def test_metadata_endpoint_returns_row_count():
    client = _client_with([{"row_count": 9999}])
    response = client.get("/api/analytics/seattle-fire-911/metadata")
    assert response.status_code == 200
    body = response.json()
    assert body["table"] == "cat.schema.fire_911"
    assert body["rowCount"] == 9999
    assert "fetchedAt" in body


def test_metadata_returns_503_when_table_unconfigured(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    client = _client_with([{"row_count": 0}])
    response = client.get("/api/analytics/seattle-fire-911/metadata")
    assert response.status_code == 503
    assert "SEATTLE_FIRE_911_TABLE" in response.json()["detail"]


def test_metadata_returns_502_on_upstream_failure():
    class BrokenDataSource:
        def execute(self, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
            raise ConnectionError("warehouse offline")

    app.dependency_overrides[_datasource_dep] = lambda: BrokenDataSource()
    client = TestClient(app)
    response = client.get("/api/analytics/seattle-fire-911/metadata")
    assert response.status_code == 502


# --- /api/analytics/seattle-fire-911/recent-calls ---------------------------

def test_recent_calls_endpoint_returns_calls():
    client = _client_with([
        {
            "incident_number": "F1",
            "datetime": "2026-05-20T14:30:00.000",
            "type": "Aid Response",
            "address": "100 Pike St",
            "latitude": "47.61",
            "longitude": "-122.33",
        }
    ])
    response = client.get("/api/analytics/seattle-fire-911/recent-calls")
    assert response.status_code == 200
    body = response.json()
    assert body["table"] == "cat.schema.fire_911"
    assert len(body["calls"]) == 1
    call = body["calls"][0]
    assert call["incidentNumber"] == "F1"
    assert call["type"] == "Aid Response"
    assert call["address"] == "100 Pike St"
    assert "fetchedAt" in body


def test_recent_calls_returns_503_when_table_unconfigured(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    client = _client_with([])
    response = client.get("/api/analytics/seattle-fire-911/recent-calls")
    assert response.status_code == 503


def test_recent_calls_returns_502_on_upstream_failure():
    class BrokenDataSource:
        def execute(self, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
            raise ConnectionError("warehouse offline")

    app.dependency_overrides[_datasource_dep] = lambda: BrokenDataSource()
    client = TestClient(app)
    response = client.get("/api/analytics/seattle-fire-911/recent-calls")
    assert response.status_code == 502


# --- /api/analytics/seattle-fire-911/last-24h-by-category -------------------

def test_last_24h_by_category_endpoint_returns_buckets():
    client = _client_with([
        {"type": "Medic Response", "count": 50, "window_end": "2026-05-20T14:30:00.000"},
        {"type": "Aid Response", "count": 20, "window_end": "2026-05-20T14:30:00.000"},
    ])
    response = client.get("/api/analytics/seattle-fire-911/last-24h-by-category")
    assert response.status_code == 200
    body = response.json()
    assert body["table"] == "cat.schema.fire_911"
    assert body["windowEnd"] == "2026-05-20T14:30:00.000"
    assert len(body["buckets"]) == 2
    assert body["buckets"][0] == {"type": "Medic Response", "count": 50}
    assert body["buckets"][1] == {"type": "Aid Response", "count": 20}


def test_last_24h_by_category_returns_503_when_table_unconfigured(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    client = _client_with([])
    response = client.get("/api/analytics/seattle-fire-911/last-24h-by-category")
    assert response.status_code == 503


def test_last_24h_by_category_returns_502_on_upstream_failure():
    class BrokenDataSource:
        def execute(self, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
            raise ConnectionError("warehouse offline")

    app.dependency_overrides[_datasource_dep] = lambda: BrokenDataSource()
    client = TestClient(app)
    response = client.get("/api/analytics/seattle-fire-911/last-24h-by-category")
    assert response.status_code == 502
