# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Subdirectories with their own conventions have their own `CLAUDE.md`:

- `backend/CLAUDE.md` — Databricks model gotcha, SPA static-file fallback, response model and schemas convention, backend test layout

## Commands

Python is managed by `uv`, not `pip`. The repo uses an npm workspace, so root-level scripts dispatch to `frontend/`.

```bash
# Install
uv sync                          # backend (Python 3.11+)
npm install                      # frontend + dev tooling

# Dev (run in two terminals)
# Terminal 1 — backend
.venv/bin/uvicorn backend.main:app --reload --port 8000
# Terminal 2 — frontend
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

## Verification before declaring done

- **Frontend changes:** `npm run typecheck && npm run lint`. If logic changed, the relevant vitest file too.
- **Backend changes:** `.venv/bin/pytest tests/` for the affected module, not only the edited file's tests.
- **Plotly changes:** verify the lazy boundary in `frontend/src/components/PlotlyEmbed/PlotlyEmbed.tsx` is intact, no Plotly imports leak outside that file, and the PWA cache rules in `vite.config.ts` still isolate the plotly bundle.
- **Build-affecting changes** (anything touching `/api/*` consumers, env flags, the SPA fallback, or `vite.config.ts`): `npm run build` and confirm `backend/static/` updated cleanly.

A successful run of the quality gates is not the same as the change being correct. State what you verified, not just that it passed.

## Architecture

### Deployment target

The Docker fullstack image is the production target: FastAPI serves the React bundle as static files plus the `/api/*` routes. The Dockerfile, `docker-compose.dev.yml`, and `app.yaml` all build this image.

A GitHub Pages deploy (`.github/workflows/ci.yml` `deploy` job, frontend only, built to `frontend/dist/`) still exists as a legacy artifact while the cutover is in progress. Treat it as a stopgap, not a constraint on new work: design features for the fullstack target, don't add Pages-only fallbacks, and don't gate features behind `VITE_ENABLE_*` flags purely to keep Pages green. Flags are still appropriate as kill switches for unfinished or paused features (see Environments below).

### Build output crosses the frontend/backend boundary

`frontend/vite.config.ts` sets `build.outDir` to `../backend/static/`. That means `npm run build` (run from repo root or `frontend/`) overwrites `backend/static/`, which is what the Docker image serves. The legacy Pages CI job overrides this with `--outDir dist` on the CLI.

The SPA static-file fallback lives in `backend/main.py` and has its own gotcha. See `backend/CLAUDE.md`.

### Frontend routing and code splitting

`App.tsx` uses `React.lazy` for every page and `Router` `basename={import.meta.env.BASE_URL}`. Vite's `base` is currently `/` (see `vite.config.ts`), and the router picks up the matching `BASE_URL` automatically. If the app is ever served from a sub-path, update `base` and both sides stay in sync.

Plotly is heavy (~1 MB) and lives behind code splitting + dedicated cache. Don't import Plotly anywhere outside `PlotlyEmbed` — see `frontend/src/components/PlotlyEmbed/CLAUDE.md`.

### Sentry, two DSNs, two lifecycles

- `SENTRY_DSN` is read at FastAPI startup (`backend/main.py`), runtime config, settable via the active `backend/.env.{APP_ENV}` file or any env var that beats it (Docker `ENV`, shell export).
- `VITE_SENTRY_DSN` is **baked into the JS bundle at build time** (see Dockerfile `ARG`/`ENV`). Changing it requires `npm run build` (or a Docker rebuild). Both should normally point at the same project.

### Environments: dev / test / prod per tier

Frontend and backend each have independent `development`, `test`, and `production` envs. "Fullstack" is a build target (the Docker image bundling both tiers), not an environment.

**Frontend** uses Vite's native `MODE`:

- `vite` (dev server) → `MODE=development`, loads `frontend/.env.development`.
- `vitest` / `vite --mode test` → `MODE=test`, loads `frontend/.env.test`.
- `vite build` → `MODE=production`, loads `frontend/.env.production`. Used by the Docker build stage (and the legacy Pages CI job, until it's retired).
- The committed `.env.{mode}` files hold safe defaults (no secrets). Use `frontend/.env.{mode}.local` (gitignored) for local secrets and overrides.

**Backend** uses `APP_ENV` (default `development`). `backend/main.py` calls `load_dotenv(backend/.env.{APP_ENV})` at startup with `override=False`, so values already in the process environment (Docker `ENV`, CI workflow `env:`, shell exports) always win over the file.

- Templates are committed at `backend/.env.{development,test,production}.example`. Copy to `backend/.env.{env}` (gitignored) and fill in real values.
- The CI test job sets `APP_ENV=test`.
- The Dockerfile sets `APP_ENV=production` at runtime.

**Feature flags are orthogonal to env.** `VITE_ENABLE_EMOTION_DEMO` gates the emotion-detection UI on the MIT page as a kill switch. Defaults to `false` in every committed `.env.{mode}`; the Dockerfile sets it to `true` in the build stage when the demo is live. Use this pattern for paused or unfinished features, not as a Pages-vs-fullstack switch.

## Conventions

- **Writing style** in prose, commit messages, and PR descriptions: no em dashes, no emoji. Use commas, colons, periods. (Goal: enforce via pre-commit; until then, respect manually.)
- **Path basenames** in code references: pages live in `frontend/src/pages/<Name>Page/`, components in `frontend/src/components/<Name>/`, with co-located CSS modules (`*.module.css`, camelCase locals per `vite.config.ts`).
- **API client** is in `frontend/src/api/`. Always call relative `/api/*` paths so the Vite proxy and the production catch-all both work.
- **Static data** for pages (project lists, books, etc.) is in `frontend/src/data/`, kept out of components so it can be tree-shaken / refactored independently.
- **`frontend/src/pages/BooksPage/`** is intentionally not yet registered in `App.tsx` or `data/routes.ts`. It's reserved for a future book-reviews section; leave the directory and its vitest file in place even though they look orphaned.

### Tests

- **Backend:** pytest, one `test_<module>.py` per backend module under repo-root `tests/`. Mirror the structure of `backend/`.
- **Frontend unit:** vitest, co-located with source as `<Name>.test.tsx` / `<Name>.test.ts`.
- **Frontend E2E:** playwright in `frontend/e2e/`, one `.spec.ts` per user-facing flow. Tests boot the Vite dev server via the `webServer` config — don't start it manually.

### Adding a backend-dependent feature

1. Add the FastAPI route under `/api/*` in a feature module (`backend/<feature>/router.py`). Define request/response Pydantic models in `backend/<feature>/schemas.py` and have the service layer return typed models so FastAPI infers the response shape from the return annotation. See `backend/CLAUDE.md` for the full convention.
2. Wire the UI to the relative `/api/*` path via `frontend/src/api/`. The Vite proxy handles dev, the SPA fallback handles prod.
3. If the feature isn't ready or you want a kill switch, add a `VITE_ENABLE_<NAME>` flag (default `false` in `.env.{mode}`, set `true` in the Dockerfile build stage when shipping it on). Otherwise no flag is needed: the fullstack image always has the backend present.
