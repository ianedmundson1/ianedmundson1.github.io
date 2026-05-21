"""Databricks SQL warehouse implementation of the DataSource protocol.

Uses databricks-sql-connector (not the WorkspaceClient SDK used elsewhere
in main.py for serving endpoints). The two are separate Databricks
integrations with different config: serving endpoints need host+token,
SQL warehouses additionally need an HTTP path.
"""

from __future__ import annotations

import os
from typing import Any, Mapping
from urllib.parse import urlparse

from databricks import sql


def _hostname(host: str) -> str:
    # The connector wants a bare hostname, not a URL. Accept either.
    if "://" in host:
        return urlparse(host).hostname or host
    return host


class DatabricksDataSource:
    """Opens a fresh connection per query.

    Pooling could come later, but at the scale of a portfolio site the
    cache layer in backend/analytics/service.py absorbs almost all traffic,
    so the cost of repeated connects is negligible.
    """

    def execute(
        self,
        sql_text: str,
        params: Mapping[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        host = os.environ.get("DATABRICKS_HOST")
        token = os.environ.get("DATABRICKS_TOKEN")
        http_path = os.environ.get("DATABRICKS_HTTP_PATH")
        if not host or not token or not http_path:
            raise RuntimeError(
                "Databricks SQL warehouse is not configured. "
                "Set DATABRICKS_HOST, DATABRICKS_TOKEN, DATABRICKS_HTTP_PATH.",
            )

        with sql.connect(
            server_hostname=_hostname(host),
            http_path=http_path,
            access_token=token,
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute(sql_text, parameters=dict(params or {}))
                columns = [c[0] for c in cursor.description or []]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]
