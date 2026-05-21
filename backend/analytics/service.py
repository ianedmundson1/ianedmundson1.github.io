"""Cached query functions for the analytics router.

Each function takes a DataSource (so tests can inject a FakeDataSource),
runs a small aggregation, and caches the result in a process-local
TTLCache. The cache key includes the resolved table name so a swap of
SEATTLE_FIRE_911_TABLE between deploys does not return stale rows.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from cachetools import TTLCache

from backend.datasource import DataSource

from . import queries

from .schemas import SeattleFire911MetadataResponse, Fire911RecentCall, Fire911RecentCallsResponse, Fire911CategoryBucket, Fire911Last24hByCategoryResponse

_CACHE_TTL_SECONDS = 15 * 60
_metadata_cache = TTLCache[str, SeattleFire911MetadataResponse](maxsize=8, ttl=_CACHE_TTL_SECONDS)

_metadata_cache_recent_calls = TTLCache[str, Fire911RecentCallsResponse](maxsize=8, ttl=_CACHE_TTL_SECONDS)

_metadata_cache_last_24h_by_category = TTLCache[str, Fire911Last24hByCategoryResponse](maxsize=8, ttl=_CACHE_TTL_SECONDS)

def _fire_911_table() -> str:
    table = os.environ.get("SEATTLE_FIRE_911_TABLE")
    if not table:
        raise RuntimeError("SEATTLE_FIRE_911_TABLE is not configured")
    return table

def fire_911_recent_calls(ds: DataSource) -> Fire911RecentCallsResponse:
    table = _fire_911_table()
    cached = _metadata_cache_recent_calls.get(table)
    if cached is not None:
        return cached

    rows = ds.execute(queries.fire_911_recent_calls(table))
    calls = [
        Fire911RecentCall(
            incidentNumber=row["incident_number"],
            datetime=row["datetime"],
            type=row["type"],
            address=row["address"],
            latitude=row.get("latitude"),
            longitude=row.get("longitude"),
        )
        for row in rows
    ]
    result = Fire911RecentCallsResponse(
        table=table, calls=calls, fetchedAt=datetime.now(timezone.utc).isoformat()
    )
    _metadata_cache_recent_calls[table] = result
    return result


def fire_911_last_24h_by_category(ds: DataSource) -> Fire911Last24hByCategoryResponse:
    table = _fire_911_table()
    cached = _metadata_cache_last_24h_by_category.get(table)
    if cached is not None:
        return cached

    rows = ds.execute(queries.fire_911_last_24h_by_category(table))
    window_end = rows[0]["window_end"] if rows else ""
    buckets = [
        Fire911CategoryBucket(type=row["type"], count=int(row["count"]))
        for row in rows
    ]
    result = Fire911Last24hByCategoryResponse(
        table=table,
        windowEnd=window_end,
        buckets=buckets,
        fetchedAt=datetime.now(timezone.utc).isoformat(),
    )
    _metadata_cache_last_24h_by_category[table] = result
    return result


def fire_911_metadata(ds: DataSource) -> SeattleFire911MetadataResponse:
    """Row count + table identifier + when this data was last pulled."""
    table = _fire_911_table()
    
    cached = _metadata_cache.get(table)
    
    if cached is not None:
        return cached

    rows = ds.execute(queries.fire_911_row_count(table))
    
    row_count = int(rows[0]["row_count"]) if rows else 0
    
    result = SeattleFire911MetadataResponse(
        table=table, rowCount=row_count, fetchedAt=datetime.now(timezone.utc).isoformat()
    )
    
    _metadata_cache[table] = result
    
    return result

def clear_caches() -> None:
    """For tests. Production code should rely on the TTL."""
    _metadata_cache.clear()
    _metadata_cache_recent_calls.clear()
    _metadata_cache_last_24h_by_category.clear()
