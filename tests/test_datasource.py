from unittest.mock import MagicMock, patch

import pytest

from backend import datasource as ds_module
from backend.datasource import DataSource, get_datasource, reset_datasource
from backend.datasource.databricks import DatabricksDataSource, _hostname


@pytest.fixture(autouse=True)
def _reset_singleton():
    reset_datasource()
    yield
    reset_datasource()


def test_factory_returns_databricks_by_default(monkeypatch):
    monkeypatch.delenv("DATA_SOURCE", raising=False)
    ds = get_datasource()
    assert isinstance(ds, DatabricksDataSource)


def test_factory_honors_data_source_env(monkeypatch):
    monkeypatch.setenv("DATA_SOURCE", "databricks")
    ds = get_datasource()
    assert isinstance(ds, DatabricksDataSource)


def test_factory_rejects_unknown_backend(monkeypatch):
    monkeypatch.setenv("DATA_SOURCE", "no-such-backend")
    with pytest.raises(RuntimeError, match="Unknown DATA_SOURCE"):
        get_datasource()


def test_factory_returns_singleton(monkeypatch):
    monkeypatch.setenv("DATA_SOURCE", "databricks")
    assert get_datasource() is get_datasource()


def test_databricks_impl_satisfies_protocol():
    # runtime_checkable Protocol: structural check at runtime.
    assert isinstance(DatabricksDataSource(), DataSource)


def test_hostname_strips_scheme():
    assert _hostname("https://workspace.azuredatabricks.net") == "workspace.azuredatabricks.net"
    assert _hostname("workspace.azuredatabricks.net") == "workspace.azuredatabricks.net"


def test_databricks_execute_requires_credentials(monkeypatch):
    monkeypatch.delenv("DATABRICKS_HOST", raising=False)
    monkeypatch.delenv("DATABRICKS_TOKEN", raising=False)
    monkeypatch.delenv("DATABRICKS_HTTP_PATH", raising=False)
    with pytest.raises(RuntimeError, match="not configured"):
        DatabricksDataSource().execute("SELECT 1")


def test_databricks_execute_returns_dict_rows(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "https://workspace.databricks.com")
    monkeypatch.setenv("DATABRICKS_TOKEN", "tok")
    monkeypatch.setenv("DATABRICKS_HTTP_PATH", "/sql/1.0/warehouses/abc")

    fake_cursor = MagicMock()
    fake_cursor.description = [("row_count", None)]
    fake_cursor.fetchall.return_value = [(42,)]
    fake_cursor.__enter__.return_value = fake_cursor
    fake_cursor.__exit__.return_value = False

    fake_conn = MagicMock()
    fake_conn.cursor.return_value = fake_cursor
    fake_conn.__enter__.return_value = fake_conn
    fake_conn.__exit__.return_value = False

    with patch("backend.datasource.databricks.sql.connect", return_value=fake_conn) as connect:
        rows = DatabricksDataSource().execute("SELECT COUNT(*) AS row_count FROM t")

    assert rows == [{"row_count": 42}]
    connect.assert_called_once_with(
        server_hostname="workspace.databricks.com",
        http_path="/sql/1.0/warehouses/abc",
        access_token="tok",
    )
    fake_cursor.execute.assert_called_once_with("SELECT COUNT(*) AS row_count FROM t", parameters={})


def test_reset_datasource_clears_singleton(monkeypatch):
    monkeypatch.setenv("DATA_SOURCE", "databricks")
    first = get_datasource()
    ds_module.reset_datasource()
    second = get_datasource()
    assert first is not second
