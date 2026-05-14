# ── Stage 1: Build frontend ────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
COPY frontend/package.json ./frontend/
RUN npm ci

COPY tsconfig.json ./
COPY frontend/ ./frontend/

# VITE_SENTRY_DSN is baked into the JS bundle at build time
ARG VITE_SENTRY_DSN=""
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

# Backend is present in this image, so enable the demo. Vite's `.env.production`
# defaults this to false (safe for Pages deploys that have no backend); this
# ENV overrides for the fullstack build.
ENV VITE_ENABLE_EMOTION_DEMO=true

# Outputs to backend/static/ as configured in frontend/vite.config.ts
RUN npm run build

# ── Stage 2: Python runtime ───────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

# Install uv for fast dependency resolution
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Create a non-root user to run the app
RUN useradd --no-create-home --shell /bin/false appuser

# Install Python dependencies (locked, no dev deps)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from stage 1 (overwrites any stale files in backend/static/)
COPY --from=frontend-build /app/backend/static/ ./backend/static/

RUN chown -R appuser:appuser /app

USER appuser

# Runtime environment for backend/main.py. Selects backend/.env.production.
ENV APP_ENV=production

EXPOSE 8000

CMD ["/app/.venv/bin/uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]