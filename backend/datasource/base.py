"""DataSource protocol shared by all analytics backends.

The protocol is intentionally minimal: one `execute` method that returns a
list of dicts. Dialect differences (date functions, identifier quoting,
LIMIT vs TOP) leak through any abstraction, so they live in the SQL
strings in backend/analytics/queries.py, not here.

Parameter style is named (:foo), matching databricks-sql-connector's
paramstyle="named". Future implementations are responsible for translating
to their driver's paramstyle if it differs.
"""

from __future__ import annotations

from typing import Any, Mapping, Protocol, runtime_checkable


@runtime_checkable
class DataSource(Protocol):
    def execute(
        self,
        sql: str,
        params: Mapping[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """Run a read query and return rows as dicts keyed by column name."""
        ...
