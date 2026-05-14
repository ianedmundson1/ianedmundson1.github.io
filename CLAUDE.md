# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Python is managed by `uv`, not `pip`. The repo uses an npm workspace, so root-level scripts dispatch to `frontend/`.

```bash
# Install
uv sync                          # backend (Python 3.11+)
npm install                      # frontend + dev tooling

# Dev (run both)
.venv/bin/uvicorn backend.main:app --reload --port 8000
npm run dev                      # Vite on :5173, proxies /api → :8000

# Build (writes to backend/static/, see "Build output" below)
npm run build

# Quality gates
npm run lint                     # eslint
npm run typecheck                # tsc --noEmit
npm test                         # vitest (frontend unit)
npm run test:watch
npm run test:e2e                 # playwright (boots Vite via webServer config)
.venv/bin/pytest tests/ -v       # backend
.venv/bin/pytest tests/test_main.py::test_name -v   # single test

# Container
docker compose -f docker-compose.dev.yml up --build
```

The pre-commit hook runs `lint-staged` (eslint --fix on staged TS/TSX) and `typecheck`. Don't bypass with `--no-verify`.

## Architecture

### Two deployment targets from one repo

This is the load-bearing fact. The same React app ships to two places, and they have different capabilities:

1. **GitHub Pages** (`.github/workflows/ci.yml` `deploy` job, on push to `main`) — frontend only, built to `frontend/dist/`. **No backend, no `/api/*`.** The Emotion Classifier and any future backend-dependent features will not work here.
2. **Docker / local full stack** — FastAPI serves the same React bundle as static files plus the `/api/*` routes. This is what the Dockerfile, `docker-compose.dev.yml`, and `app.yaml` build.

When adding a feature, decide up front which target it must work on. Pages-only features must be self-contained in the frontend (no backend calls).

### Build output crosses the frontend/backend boundary

`frontend/vite.config.ts` sets `build.outDir` to `../backend/static/`. That means `npm run build` (run from repo root or `frontend/`) overwrites `backend/static/`. The Docker GitHub Pages build overrides this with `--outDir dist` on the CLI.

`backend/main.py` does not use `StaticFiles.mount` (it's commented out intentionally). Instead, the `serve_react` catch-all at the bottom does: try to serve the requested file from `backend/static/`, else fall back to `index.html`. This is the SPA routing fallback, required so deep links like `/projects/rag-demo` work in the full-stack deploy. Don't replace it with a `StaticFiles` mount, that breaks SPA fallback.

### Frontend routing and code splitting

`App.tsx` uses `React.lazy` for every page and `Router` `basename={import.meta.env.BASE_URL}`. The basename matters because the GitHub Pages deploy historically may live at a sub-path. Vite's `base` is currently `/` (see `vite.config.ts`), so changing the deploy path requires updating both.

Plotly is heavy (~1 MB). It's split out via the `plotly-gl3d-dist-min` import in `PlotlyEmbed`, and the service worker (`vite-plugin-pwa`) caches the bundle separately (`plotly-bundle` cache). Don't import Plotly anywhere outside `PlotlyEmbed`.

### Plotly figure pipeline

Three-stage pipeline that is easy to break by editing the wrong layer:

1. **Notebook export** → raw `frontend/public/<name>.html` with embedded `Plotly.newPlot(...)` (theme-loaded with the notebook's defaults).
2. **`scripts/theme_plotly_html.py`** parses the HTML, extracts the `data` and `layout` args, strips theme-specific styling (fonts, axis colors, paper/plot bg, template, optionally title) and writes `frontend/public/plots/<name>.json`. Run this after re-exporting from a notebook.
3. **`scripts/export_plot_posters.py`** renders WebP poster images per theme (`light`, `dark`) used as placeholders before the Plotly bundle/JSON loads, and as the only render on touch devices.

The theme tokens in `export_plot_posters.py` (`THEMES`) **mirror** `THEME_TOKENS` in `frontend/src/components/PlotlyEmbed/PlotlyEmbed.tsx`. If you change colors in the React component, update the script and re-run it, otherwise posters will visually disagree with the live chart. `TARGETS` lists the figures both scripts know about, keep them in sync.

Kaleido (used for PNG rendering in the poster script) needs Chrome: `plotly_get_chrome` once before first run.

### Databricks emotion model — preprocessing gotcha

`backend/main.py` `post_emotion_classification` resizes uploads to 48x48 RGB and passes **raw 0-255 float pixel values** to the model. Do not add `/ 255.0` normalization, the Databricks `emotional-identifier` endpoint does its own scaling internally. There's a comment at the call site reinforcing this; it has been wrong before.

`normalize_prediction` is defensive on purpose — the upstream response shape has shifted between `predictions` / `outputs`, and label/score key names vary (`label`/`emotion`/`prediction`, `score`/`confidence`/`probability`). Keep the fallbacks when extending.

### Sentry — two DSNs, two lifecycles

- `SENTRY_DSN` is read at FastAPI startup (`backend/main.py`), runtime config, settable via the active `backend/.env.{APP_ENV}` file or any env var that beats it (Docker `ENV`, shell export).
- `VITE_SENTRY_DSN` is **baked into the JS bundle at build time** (see Dockerfile `ARG`/`ENV`). Changing it requires `npm run build` (or a Docker rebuild). Both should normally point at the same project.

### Environments: dev / test / prod per tier

Frontend and backend each have independent `development`, `test`, and `production` envs. "Fullstack" is a build target (the Docker image bundling both tiers), not an environment.

**Frontend** uses Vite's native `MODE`:

- `vite` (dev server) → `MODE=development`, loads `frontend/.env.development`.
- `vitest` / `vite --mode test` → `MODE=test`, loads `frontend/.env.test`.
- `vite build` → `MODE=production`, loads `frontend/.env.production`. Used by both the GitHub Pages CI deploy and the Docker build stage.
- The committed `.env.{mode}` files hold safe defaults (no secrets). Use `frontend/.env.{mode}.local` (gitignored) for local secrets and overrides.

**Backend** uses `APP_ENV` (default `development`). `backend/main.py` calls `load_dotenv(backend/.env.{APP_ENV})` at startup with `override=False`, so values already in the process environment (Docker `ENV`, CI workflow `env:`, shell exports) always win over the file.

- Templates are committed at `backend/.env.{development,test,production}.example`. Copy to `backend/.env.{env}` (gitignored) and fill in real values.
- The CI test job sets `APP_ENV=test`.
- The Dockerfile sets `APP_ENV=production` at runtime.

**Feature flags are orthogonal to env.** `VITE_ENABLE_EMOTION_DEMO` gates the emotion-detection UI on the MIT page. Defaults to `false` in every committed `.env.{mode}` (safe for Pages, which has no backend). The Dockerfile sets `VITE_ENABLE_EMOTION_DEMO=true` in the build stage so the fullstack image keeps the demo live. When adding a backend-dependent feature, follow the same pattern: gate it on a `VITE_ENABLE_*` flag, default off in the committed env files, override `true` where the backend is present.

## Conventions

- **Writing style in prose / commit messages / PR descriptions:** no em dashes, no emoji. Use commas, colons, periods.
- **Path basenames** in code references: pages live in `frontend/src/pages/<Name>Page/`, components in `frontend/src/components/<Name>/`, with co-located CSS modules (`*.module.css`, camelCase locals per `vite.config.ts`).
- **API client** is in `frontend/src/api/`. Always call relative `/api/*` paths so the Vite proxy and the production catch-all both work.
- **Static data** for pages (project lists, books, etc.) is in `frontend/src/data/`, kept out of components so it can be tree-shaken / refactored independently.
