from typing import Any, Mapping

import pytest

from backend.analytics import service


class FakeDataSource:
    def __init__(self, rows: list[dict[str, Any]]):
        self.rows = rows
        self.calls: list[tuple[str, Mapping[str, Any] | None]] = []

    def execute(self, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
        self.calls.append((sql, params))
        return self.rows


@pytest.fixture(autouse=True)
def _clear_caches():
    service.clear_caches()
    yield
    service.clear_caches()


@pytest.fixture
def _table_env(monkeypatch):
    monkeypatch.setenv("SEATTLE_FIRE_911_TABLE", "cat.schema.fire_911")


def test_fire_911_metadata_returns_row_count(_table_env):
    ds = FakeDataSource([{"row_count": 12345}])
    result = service.fire_911_metadata(ds)
    assert result.table == "cat.schema.fire_911"
    assert result.rowCount == 12345
    assert result.fetchedAt


def test_fire_911_metadata_caches_result(_table_env):
    ds = FakeDataSource([{"row_count": 1}])
    service.fire_911_metadata(ds)
    service.fire_911_metadata(ds)
    assert len(ds.calls) == 1, "second call should be served from the TTLCache"


def test_fire_911_metadata_requires_table_env(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    ds = FakeDataSource([{"row_count": 0}])
    with pytest.raises(RuntimeError, match="SEATTLE_FIRE_911_TABLE"):
        service.fire_911_metadata(ds)


def test_fire_911_metadata_handles_empty_result(_table_env):
    ds = FakeDataSource([])
    result = service.fire_911_metadata(ds)
    assert result.rowCount == 0


def test_fire_911_metadata_interpolates_table_into_sql(_table_env):
    ds = FakeDataSource([{"row_count": 5}])
    service.fire_911_metadata(ds)
    sql, _ = ds.calls[0]
    assert "cat.schema.fire_911" in sql
