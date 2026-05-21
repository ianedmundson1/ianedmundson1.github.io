"""FastAPI router for analytics endpoints.

Mounted from backend/main.py at app construction. Each endpoint depends
on `_datasource_dep`, which tests override with a FakeDataSource so no
network is required.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException

from backend.datasource import DataSource, get_datasource

from . import service

from .schemas import SeattleFire911MetadataResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

def _datasource_dep() -> DataSource:
    return get_datasource()
    
@router.get("/seattle-fire-911/metadata")
def seattle_fire_911_metadata(ds: DataSource = Depends(_datasource_dep)) -> SeattleFire911MetadataResponse:
    try:
        return service.fire_911_metadata(ds)
    except RuntimeError as exc:
        # Configuration error: missing env var. 503 because the service
        # could become ready without a code change.
        logger.warning("Analytics misconfigured: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        logger.exception("Failed to query Seattle Fire 911 metadata")
        raise HTTPException(status_code=502, detail="Upstream analytics query failed")