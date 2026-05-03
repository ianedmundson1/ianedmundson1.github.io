# Ian Edmundson — Portfolio

Personal portfolio and project showcase for Ian Edmundson, Data Scientist & Software Engineer.

Built with a **React + TypeScript** frontend and a **FastAPI** backend, containerized with Docker and deployed to **Azure Container Apps**.

## Features

- **Portfolio homepage** — overview of expertise, technical impact, and technologies
- **Projects page** — showcase of data science and engineering projects
- **Emotion Classifier** — live computer vision demo backed by a Databricks model-serving endpoint; accepts image uploads or webcam captures and returns emotion predictions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | FastAPI, Python 3.11, uvicorn |
| ML Inference | Databricks Model Serving (FER2013 emotion classifier) |
| Containerization | Docker (multi-stage build) |
| Deployment | Azure Container Apps |
| Testing | pytest + FastAPI TestClient, Vitest + Testing Library |
| Dependencies | uv (Python), npm (JS) |

## Project Structure

```
├── backend/          # FastAPI app + compiled frontend assets
│   ├── main.py       # API routes and Databricks inference
│   └── static/       # Built React app (output of npm run build)
├── frontend/         # React + TypeScript source
│   └── src/
│       ├── pages/    # Route-level page components
│       ├── components/  # Reusable components (Navigation)
│       ├── utils/    # API client
│       └── types/    # TypeScript types
├── tests/            # Backend pytest tests
├── Dockerfile        # Multi-stage build (Node → Python)
└── .vscode/          # Tasks and launch configs for local dev
```

## Local Development

**Prerequisites:** Python 3.11+, Node.js 22+, [uv](https://docs.astral.sh/uv/)

```bash
# Install dependencies
uv sync
npm install

# Set up environment
cp .env.example .env  # add DATABRICKS_HOST and DATABRICKS_TOKEN

# Start both servers (VS Code)
# Ctrl+Shift+P → Tasks: Run Task → Start Full Stack

# Or manually:
.venv/bin/uvicorn backend.main:app --reload --port 8000  # backend on :8000
npm run dev                                               # frontend on :5173
```

The Vite dev server proxies `/api/*` requests to the backend automatically.

## Running Tests

```bash
# Backend
.venv/bin/pytest tests/ -v

# Frontend
npm test
```

Or use **Ctrl+Shift+P → Tasks: Run Test Task** in VS Code.

## Docker

```bash
# Build
docker build -t ianedmundsongithub .

# Run
docker run -p 8000:8000 \
  -e DATABRICKS_HOST=https://<your-workspace>.cloud.databricks.com/ \
  -e DATABRICKS_TOKEN=<your-pat-token> \
  ianedmundsongithub
```

Open [http://localhost:8000](http://localhost:8000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABRICKS_HOST` | Databricks workspace URL |
| `DATABRICKS_TOKEN` | Personal access token for model serving |

## Links

- [GitHub](https://github.com/ianedmundson1)
- [LinkedIn](https://linkedin.com/in/ian-edmundson-a0979a178)
