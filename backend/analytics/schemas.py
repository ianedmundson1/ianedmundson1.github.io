"""Pydantic models for analytics API requests and responses.

Importing from this module is safe from any layer (router, service, tests).
Models live here so they can be reused without circular imports.
"""

from __future__ import annotations

from pydantic import BaseModel

class SeattleFire911MetadataResponse(BaseModel):
    table: str
    rowCount: int
    fetchedAt: str