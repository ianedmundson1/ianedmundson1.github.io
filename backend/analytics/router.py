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

from .schemas import SeattleFire911MetadataResponse, Fire911RecentCallsResponse, Fire911Last24hByCategoryResponse

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
    
@router.get("/seattle-fire-911/recent-calls")
def seattle_fire_911_recent_calls(ds: DataSource = Depends(_datasource_dep)) -> Fire911RecentCallsResponse:
    try:
        return service.fire_911_recent_calls(ds)
    except RuntimeError as exc:
        logger.warning("Analytics misconfigured: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        logger.exception("Failed to query Seattle Fire 911 recent calls")
        raise HTTPException(status_code=502, detail="Upstream analytics query failed")
    
@router.get("/seattle-fire-911/last-24h-by-category")
def seattle_fire_911_last_24h_by_category(ds: DataSource = Depends(_datasource_dep)) -> Fire911Last24hByCategoryResponse:
    try:
        return service.fire_911_last_24h_by_category(ds)
    except RuntimeError as exc:
        logger.warning("Analytics misconfigured: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception:
        logger.exception("Failed to query Seattle Fire 911 last 24h by category")
        raise HTTPException(status_code=502, detail="Upstream analytics query failed")