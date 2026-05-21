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
