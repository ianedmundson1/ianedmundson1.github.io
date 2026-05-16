# Ian Edmundson, Portfolio

Personal portfolio and project showcase for Ian Edmundson, Data Scientist and Software Engineer.

Built with a **React + TypeScript** frontend and a **FastAPI** backend, containerized with Docker. The same React app ships to two deployment targets from this repo:

1. **GitHub Pages** (frontend only), built and deployed via GitHub Actions on push to `main`. No backend, no `/api/*`.
2. **Docker / local full stack**, where FastAPI serves the React bundle as static files plus the `/api/*` routes.

Features that require the backend (for example, the Emotion Classifier) are gated behind feature flags and disabled on the Pages build.

## Features

- **Portfolio homepage**, overview of expertise, technical impact, and technologies.
- **Projects page**, showcase of data science and engineering projects with embedded Plotly figures.
- **Emotion Classifier**, live computer vision demo backed by a Databricks model-serving endpoint. Accepts image uploads or webcam captures and returns emotion predictions. Available only on the full-stack deploy.

## Tech Stack

| Layer            | Technology                                              |
|------------------|---------------------------------------------------------|
| Frontend         | React 19, TypeScript, Vite, CSS Modules                 |
| Charts           | Plotly (lazy-loaded, code-split)                        |
| Backend          | FastAPI, Python 3.11, uvicorn                           |
| ML Inference     | Databricks Model Serving (FER2013 emotion classifier)   |
| Observability    | Sentry (frontend bundle + backend runtime)              |
| PWA              | vite-plugin-pwa (offline shell, Plotly bundle cache)    |
| Containerization | Docker (multi-stage build)                              |
| Deployment       | GitHub Pages (frontend), Docker (full stack)            |
| Testing          | pytest, Vitest + Testing Library, Playwright (e2e)      |
| Dependencies     | uv (Python), npm workspaces (JS)                        |

## Project Structure

```text
├── backend/                # FastAPI app + compiled frontend assets
│   ├── main.py             # API routes and Databricks inference
│   ├── static/             # Built React app (output of npm run build)
│   └── .env.{env}.example  # Per-environment backend config templates
├── frontend/               # React + TypeScript source (npm workspace)
│   ├── src/
│   │   ├── pages/          # Route-level page components
│   │   ├── components/     # Reusable components with co-located CSS modules
│   │   ├── api/            # API client (relative /api/* paths)
│   │   ├── data/           # Static page data (projects, books, ...)
│   │   ├── context/        # React context providers (theme, ...)
│   │   ├── hooks/          # Custom hooks
│   │   ├── theme/          # Design tokens
│   │   └── sentry.ts       # Frontend Sentry init
│   ├── public/plots/       # Themed Plotly JSON figures
│   └── .env.{mode}         # Per-mode frontend config
├── scripts/
│   ├── theme_plotly_html.py     # Strip notebook theming, emit JSON
│   └── export_plot_posters.py   # Render WebP posters per theme
├── tests/                  # Backend pytest tests
├── Dockerfile              # Multi-stage build (Node → Python)
└── docker-compose.dev.yml  # Local full-stack stack
```

## Local Development

**Prerequisites:** Python 3.11+, Node.js 22+, [uv](https://docs.astral.sh/uv/).

```bash
# Install
uv sync
npm install

# Set up environment (copy templates, then fill in real values)
cp backend/.env.development.example backend/.env.development
# Frontend env defaults live in committed frontend/.env.{mode} files;
# put local secrets in frontend/.env.{mode}.local (gitignored).

# Run both servers
.venv/bin/uvicorn backend.main:app --reload --port 8000   # backend on :8000
npm run dev                                                # frontend on :5173
```

The Vite dev server proxies `/api/*` to the backend automatically.

## Environments

Frontend and backend each support `development`, `test`, and `production`.

- **Frontend** uses Vite's native `MODE`, which selects the matching `frontend/.env.{mode}` file. `vite` runs in `development`, `vitest` and `vite --mode test` run in `test`, and `vite build` runs in `production`. Use `frontend/.env.{mode}.local` for secrets and overrides.
- **Backend** reads `APP_ENV` (default `development`) and loads `backend/.env.{APP_ENV}` with `override=False`, so process env vars (Docker, CI, shell exports) always win over the file.

## Feature Flags

Backend-dependent UI is gated so the GitHub Pages build stays functional without an API.

| Flag                       | Purpose                                            | Default                                               |
|----------------------------|----------------------------------------------------|-------------------------------------------------------|
| `VITE_ENABLE_EMOTION_DEMO` | Enables the emotion-detection UI on the MIT page   | `false` in committed envs, `true` in the Docker build |

When adding a backend-dependent feature, gate it on a `VITE_ENABLE_*` flag, default off in the committed env files, and override `true` where the backend is present.

## Quality Gates

```bash
npm run lint                     # eslint
npm run typecheck                # tsc --noEmit
npm test                         # vitest (frontend unit)
npm run test:watch
npm run test:e2e                 # playwright (boots Vite via webServer config)
.venv/bin/pytest tests/ -v       # backend
```

A pre-commit hook runs `lint-staged` and `typecheck`. Do not bypass it with `--no-verify`.

## Docker

```bash
# Local full stack (compose)
docker compose -f docker-compose.dev.yml up --build

# Or build and run directly
docker build -t ianedmundsongithub .
docker run -p 8000:8000 \
  -e DATABRICKS_HOST=https://<your-workspace>.cloud.databricks.com/ \
  -e DATABRICKS_TOKEN=<your-pat-token> \
  ianedmundsongithub
```

Open [http://localhost:8000](http://localhost:8000).

## Plotly Figure Pipeline

Plotly figures move through three stages. The first two run only when re-exporting from a notebook.

1. Notebook export writes raw `frontend/public/<name>.html` with embedded `Plotly.newPlot(...)`.
2. `scripts/theme_plotly_html.py` strips theme-specific styling and writes `frontend/public/plots/<name>.json`.
3. `scripts/export_plot_posters.py` renders WebP poster images per theme (used as placeholders, and as the only render on touch devices).

The theme tokens in `export_plot_posters.py` mirror those in `frontend/src/components/PlotlyEmbed/PlotlyEmbed.tsx`. Keep them in sync, then re-run the poster script.

## Environment Variables

| Variable                   | Scope                  | Description                                       |
|----------------------------|------------------------|---------------------------------------------------|
| `DATABRICKS_HOST`          | Backend                | Databricks workspace URL                          |
| `DATABRICKS_TOKEN`         | Backend                | Personal access token for model serving           |
| `APP_ENV`                  | Backend                | Selects which `backend/.env.{env}` file to load   |
| `SENTRY_DSN`               | Backend (runtime)      | FastAPI Sentry DSN                                |
| `VITE_SENTRY_DSN`          | Frontend (build time)  | Baked into the JS bundle by `npm run build`       |
| `VITE_ENABLE_EMOTION_DEMO` | Frontend (build time)  | Gates the emotion-detection UI                    |

## Links

- [GitHub](https://github.com/ianedmundson1)
- [LinkedIn](https://linkedin.com/in/ian-edmundson-a0979a178)
