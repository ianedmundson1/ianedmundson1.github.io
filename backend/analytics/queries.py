"""SQL strings for the analytics router.

Keep queries here, not inline in service.py, so a future port to another
warehouse only touches this module. ANSI where possible; date/time
functions are the main thing that varies between dialects, so prefer
EXTRACT(... FROM CAST(col AS TIMESTAMP)) over vendor-specific helpers.

The Seattle Fire 911 calls table is in the bronze layer with all columns
typed as strings; cast `datetime` to TIMESTAMP before extracting parts.
Datetime values are ISO 8601 with millisecond precision (e.g.
"2026-03-09T08:42:00.000") which CAST handles natively.

Identifiers (table names) cannot be parameterized through the driver, so
they are interpolated from trusted env vars at query-build time. Values
that come from request input MUST go through `params` instead.
"""

from __future__ import annotations


def fire_911_row_count(table: str) -> str:
    return f"SELECT COUNT(*) AS row_count FROM {table}"

def fire_911_recent_calls(table: str, limit: int = 10) -> str:
    return f"""
        SELECT
            incident_number,
            datetime,
            type,
            address,
            latitude,
            longitude
        FROM {table}
        ORDER BY datetime DESC
        LIMIT {limit}
    """

#TODO: make the interval configurable through the API and query parameters instead of hardcoding 24 hours
def fire_911_last_24h_by_category(table: str) -> str:
    return f"""
        WITH latest AS (
            SELECT MAX(CAST(datetime AS TIMESTAMP)) AS window_end
            FROM {table}
            WHERE datetime IS NOT NULL
        )
        SELECT
            t.type AS type,
            COUNT(*) AS count,
            CAST((SELECT window_end FROM latest) AS STRING) AS window_end
        FROM {table} t
        WHERE CAST(t.datetime AS TIMESTAMP) >= ((SELECT window_end FROM latest) - INTERVAL '24' HOUR)
        GROUP BY t.type
        ORDER BY count DESC
    """
