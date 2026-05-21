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


# --- fire_911_recent_calls --------------------------------------------------

RECENT_CALL_ROW = {
    "incident_number": "F26000001",
    "datetime": "2026-05-20T14:30:00.000",
    "type": "Aid Response",
    "address": "100 Pike St",
    "latitude": "47.6097",
    "longitude": "-122.3331",
}


def test_recent_calls_returns_typed_results(_table_env):
    second_row = {**RECENT_CALL_ROW, "incident_number": "F26000002", "latitude": None, "longitude": None}
    ds = FakeDataSource([RECENT_CALL_ROW, second_row])
    result = service.fire_911_recent_calls(ds)
    assert result.table == "cat.schema.fire_911"
    assert len(result.calls) == 2
    assert result.calls[0].incidentNumber == "F26000001"
    assert result.calls[0].type == "Aid Response"
    assert result.calls[0].latitude == "47.6097"
    assert result.calls[1].latitude is None
    assert result.fetchedAt


def test_recent_calls_caches_result(_table_env):
    ds = FakeDataSource([RECENT_CALL_ROW])
    service.fire_911_recent_calls(ds)
    service.fire_911_recent_calls(ds)
    assert len(ds.calls) == 1, "second call should be served from the TTLCache"


def test_recent_calls_requires_table_env(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    ds = FakeDataSource([RECENT_CALL_ROW])
    with pytest.raises(RuntimeError, match="SEATTLE_FIRE_911_TABLE"):
        service.fire_911_recent_calls(ds)


def test_recent_calls_handles_empty_result(_table_env):
    ds = FakeDataSource([])
    result = service.fire_911_recent_calls(ds)
    assert result.calls == []
    assert result.table == "cat.schema.fire_911"


def test_recent_calls_interpolates_table_into_sql(_table_env):
    ds = FakeDataSource([])
    service.fire_911_recent_calls(ds)
    sql, _ = ds.calls[0]
    assert "cat.schema.fire_911" in sql


# --- fire_911_last_24h_by_category -----------------------------------------

CATEGORY_ROW_TOP = {
    "type": "Medic Response",
    "count": 100,
    "window_end": "2026-05-20T14:30:00.000",
}
CATEGORY_ROW_NEXT = {
    "type": "Aid Response",
    "count": 75,
    "window_end": "2026-05-20T14:30:00.000",
}


def test_last_24h_by_category_returns_buckets(_table_env):
    ds = FakeDataSource([CATEGORY_ROW_TOP, CATEGORY_ROW_NEXT])
    result = service.fire_911_last_24h_by_category(ds)
    assert result.table == "cat.schema.fire_911"
    assert result.windowEnd == "2026-05-20T14:30:00.000"
    assert len(result.buckets) == 2
    assert result.buckets[0].type == "Medic Response"
    assert result.buckets[0].count == 100
    assert result.buckets[1].type == "Aid Response"
    assert result.fetchedAt


def test_last_24h_by_category_caches_result(_table_env):
    ds = FakeDataSource([CATEGORY_ROW_TOP])
    service.fire_911_last_24h_by_category(ds)
    service.fire_911_last_24h_by_category(ds)
    assert len(ds.calls) == 1


def test_last_24h_by_category_requires_table_env(monkeypatch):
    monkeypatch.delenv("SEATTLE_FIRE_911_TABLE", raising=False)
    ds = FakeDataSource([CATEGORY_ROW_TOP])
    with pytest.raises(RuntimeError, match="SEATTLE_FIRE_911_TABLE"):
        service.fire_911_last_24h_by_category(ds)


def test_last_24h_by_category_handles_empty_result(_table_env):
    ds = FakeDataSource([])
    result = service.fire_911_last_24h_by_category(ds)
    assert result.buckets == []
    assert result.windowEnd == ""


def test_last_24h_by_category_interpolates_table_into_sql(_table_env):
    ds = FakeDataSource([])
    service.fire_911_last_24h_by_category(ds)
    sql, _ = ds.calls[0]
    assert "cat.schema.fire_911" in sql
