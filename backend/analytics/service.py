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

_CACHE_TTL_SECONDS = 15 * 60
_metadata_cache: TTLCache[str, dict[str, Any]] = TTLCache(maxsize=8, ttl=_CACHE_TTL_SECONDS)


def _fire_911_table() -> str:
    table = os.environ.get("SEATTLE_FIRE_911_TABLE")
    if not table:
        raise RuntimeError("SEATTLE_FIRE_911_TABLE is not configured")
    return table


def fire_911_metadata(ds: DataSource) -> dict[str, Any]:
    """Row count + table identifier + when this data was last pulled."""
    table = _fire_911_table()
    cached = _metadata_cache.get(table)
    if cached is not None:
        return cached

    rows = ds.execute(queries.fire_911_row_count(table))
    row_count = int(rows[0]["row_count"]) if rows else 0
    result: dict[str, Any] = {
        "table": table,
        "rowCount": row_count,
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
    }
    _metadata_cache[table] = result
    return result


def clear_caches() -> None:
    """For tests. Production code should rely on the TTL."""
    _metadata_cache.clear()
