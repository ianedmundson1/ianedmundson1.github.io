# backend/CLAUDE.md

Loaded when working under `backend/`. Root context is in the top-level `CLAUDE.md`.

## Databricks emotion model, preprocessing gotcha

`backend/main.py` `post_emotion_classification` resizes uploads to 48x48 RGB and passes **raw 0–255 float pixel values** to the model. Do not add `/ 255.0` normalization — the Databricks `emotional-identifier` endpoint does its own scaling internally. There's a comment at the call site reinforcing this; it has been wrong before.

`normalize_prediction` is defensive on purpose: the upstream response shape has shifted between `predictions` / `outputs`, and label/score key names vary (`label` / `emotion` / `prediction`, `score` / `confidence` / `probability`). Keep the fallbacks when extending.

## Static file serving and SPA fallback

`backend/main.py` does not use `StaticFiles.mount` (it's commented out intentionally). The `serve_react` catch-all at the bottom does the SPA routing fallback: try to serve the requested file from `backend/static/`, else fall back to `index.html`. Required so deep links like `/projects/rag-demo` work in the full-stack deploy.

**Do not replace this with `StaticFiles.mount` — it breaks SPA fallback.** If you need to add static behavior, layer it on top of the catch-all, don't swap it out.

## API response models and schemas

Each feature module owns its Pydantic models in `<feature>/schemas.py` (see `backend/analytics/schemas.py`). The service layer constructs and returns the typed model; the router annotates the return type and lets FastAPI infer `response_model` from it. Don't set both `response_model=` on the decorator and a typed return annotation: pick the annotation, since the function signature is closer to the data.

When a service caches its results, the cache type follows the model: `TTLCache[str, MyResponse]`, not `TTLCache[str, dict]`.

Tests assert via attribute access (`result.field`), not dict subscript. Pydantic models are not subscriptable.

## Tests

pytest, repo-root `tests/`, one `test_<module>.py` per backend module. Before declaring a backend change done, run `.venv/bin/pytest tests/` for the affected module — not just the test file you edited. Module-level runs catch fixture and import-order regressions that file-scoped runs miss.

## Environment loading

`load_dotenv(backend/.env.{APP_ENV})` is called at startup with `override=False`. Anything already in the process environment (Docker `ENV`, CI workflow `env:`, shell exports) wins over the file. If a setting "isn't picking up," check for an upstream override before editing the dotenv file.
