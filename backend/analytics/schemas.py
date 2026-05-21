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

class Fire911RecentCall(BaseModel):
    incidentNumber: str
    datetime: str
    type: str
    address: str
    latitude: str | None
    longitude: str | None
    
class Fire911RecentCallsResponse(BaseModel):
    table: str
    calls: list[Fire911RecentCall]
    fetchedAt: str
    
class Fire911CategoryBucket(BaseModel):
    type: str
    count: int

class Fire911Last24hByCategoryResponse(BaseModel):
    table: str
    windowEnd: str
    buckets: list[Fire911CategoryBucket]
    fetchedAt: str
