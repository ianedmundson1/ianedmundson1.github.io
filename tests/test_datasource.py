from unittest.mock import MagicMock, patch

import pytest

from backend.datasource import DataSource, DataSourceNotConfigured
from backend.datasource.databricks import DatabricksDataSource, _hostname


def test_databricks_impl_satisfies_protocol():
    # runtime_checkable Protocol: structural check at runtime.
    assert isinstance(DatabricksDataSource(), DataSource)


def test_hostname_strips_scheme():
    assert _hostname("https://workspace.azuredatabricks.net") == "workspace.azuredatabricks.net"
    assert _hostname("workspace.azuredatabricks.net") == "workspace.azuredatabricks.net"


def test_databricks_execute_raises_not_configured_when_settings_missing(monkeypatch):
    monkeypatch.delenv("DATABRICKS_HOST", raising=False)
    monkeypatch.delenv("DATABRICKS_TOKEN", raising=False)
    monkeypatch.delenv("DATABRICKS_HTTP_PATH", raising=False)
    with pytest.raises(DataSourceNotConfigured):
        DatabricksDataSource().execute("SELECT 1")


@pytest.mark.parametrize("blank_setting", ["DATABRICKS_HOST", "DATABRICKS_TOKEN", "DATABRICKS_HTTP_PATH"])
def test_databricks_execute_raises_not_configured_when_a_setting_is_blank(monkeypatch, blank_setting):
    monkeypatch.setenv("DATABRICKS_HOST", "https://workspace.databricks.com")
    monkeypatch.setenv("DATABRICKS_TOKEN", "tok")
    monkeypatch.setenv("DATABRICKS_HTTP_PATH", "/sql/1.0/warehouses/abc")
    monkeypatch.setenv(blank_setting, "   ")

    with patch("backend.datasource.databricks.sql.connect") as connect:
        with pytest.raises(DataSourceNotConfigured):
            DatabricksDataSource().execute("SELECT 1")

    connect.assert_not_called()


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