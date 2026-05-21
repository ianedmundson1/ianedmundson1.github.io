"""Analytics datasource factory.

Selects an implementation of the DataSource protocol based on the DATA_SOURCE
env var. Only "databricks" is wired today, but the seam is here so future
backends (postgres, bigquery, sqlite) can drop in without touching the
analytics router/service layer.
"""

from __future__ import annotations

import os
from typing import Callable

from .base import DataSource
from .databricks import DatabricksDataSource

_datasource: DataSource | None = None


_REGISTRY: dict[str, Callable[[], DataSource]] = {
    "databricks": DatabricksDataSource,
}


def get_datasource() -> DataSource:
    """Return the process-wide DataSource singleton.

    Lazy so importing this module does not open a connection at startup
    (matters for tests, which override the FastAPI dependency before any
    real query runs).
    """
    global _datasource
    if _datasource is None:
        name = os.environ.get("DATA_SOURCE", "databricks").lower()
        factory = _REGISTRY.get(name)
        if factory is None:
            raise RuntimeError(
                f"Unknown DATA_SOURCE '{name}'. Known: {sorted(_REGISTRY)}",
            )
        _datasource = factory()
    return _datasource


def reset_datasource() -> None:
    """Drop the cached singleton. For tests and env-change scenarios."""
    global _datasource
    _datasource = None


__all__ = ["DataSource", "get_datasource", "reset_datasource"]
