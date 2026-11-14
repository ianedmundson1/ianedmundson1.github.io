"""Shared rate limiter.

Lives outside main.py so feature routers can decorate routes with it
without importing main (which imports them: circular).
"""

import os

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

TRUSTED_CLIENT_IP_HEADER = os.environ.get("TRUSTED_CLIENT_IP_HEADER", "")


# Which header carries the real client IP depends entirely on what sits in
# front of this process. Getting it wrong breaks in both directions: trust a
# header that no proxy overwrites and a client can forge a fresh bucket per
# request; trust nothing and every visitor collapses into one shared bucket.
def client_ip(request: Request) -> str:
    if TRUSTED_CLIENT_IP_HEADER:
        forwarded = request.headers.get(TRUSTED_CLIENT_IP_HEADER)
        if forwarded:
            return forwarded
    return get_remote_address(request)


# Rate limiter protects the paid Databricks endpoint from abuse. The default
# limit applies globally; per-route decorators tighten further.
limiter = Limiter(key_func=client_ip, default_limits=["60/minute"])
