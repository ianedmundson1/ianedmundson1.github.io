"""Shared pytest setup.

APP_ENV must be set before backend.main is imported: main.py picks which
backend/.env.{APP_ENV} file to load at import time. Without this, a local run
defaults to development and loads real Sentry and Databricks credentials.
CI already sets APP_ENV=test; setdefault keeps that and any explicit override.
"""

import os

os.environ.setdefault("APP_ENV", "test")
