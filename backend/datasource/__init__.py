"""Analytics data source package.

`DataSource` is the seam: analytics code depends on the Protocol, production
wires in `DatabricksDataSource`, and tests override the FastAPI dependency
with a fake.
"""

from __future__ import annotations

from .base import DataSource, DataSourceNotConfigured
from .databricks import DatabricksDataSource

__all__ = ["DataSource", "DataSourceNotConfigured", "DatabricksDataSource"]
