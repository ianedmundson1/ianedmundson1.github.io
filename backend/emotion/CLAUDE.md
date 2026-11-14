# backend/emotion/CLAUDE.md

Loaded when working under `backend/emotion/`. Terms (emotion classification, emotion label, emotion model, confidence) are defined in the root `GLOSSARY.md`.

## Module map

- `service.py`: `classify_emotion(contents, model, detector)` is the only public function. It takes accepted image bytes and returns `EmotionClassificationResponse`, or raises `UnreadableImage` / `NoFaceDetected`. All preprocessing is private here.
- `router.py`: HTTP only. Content type, size limits, the 10/minute rate limit, dependency wiring, and mapping outcomes to status codes.
- `model.py`: the `EmotionModel` Protocol and its two errors. `databricks.py` is the production adapter.
- `face_detector.py`: the `FaceDetector` Protocol and the OpenCV Haar adapter.

Tests go through the HTTP endpoint with the fakes in `tests/emotion_fakes.py`, overriding `_emotion_model_dep` and `_face_detector_dep`. Don't test the private helpers in `service.py` directly.

## Emotion model input format

The Databricks emotion model expects a batch of shape `(1, 48, 48, 3)`, `float32`, grayscale stacked to three identical channels, with **raw 0-255 pixel values**.

**Never divide by 255.** The model scales internally. This has been wrong before; the comment at the line in `_prepare_batch` that builds the batch and `test_emotion_model_receives_one_48x48_three_channel_batch_of_raw_pixel_values` both guard it.

## Why response decoding is defensive

`normalize_prediction` in `databricks.py` accepts `predictions` or `outputs` wrappers, `label` / `emotion` / `prediction` for the emotion label, and `score` / `confidence` / `probability` for confidence, on a 0-1 or 0-100 scale. The upstream response shape has shifted between model versions. Keep the fallbacks when extending, and keep all decoding inside the adapter so upstream changes stay in one file.

## Lifecycles differ on purpose

- The face detector loads its cascade when `router.py` is imported and raises if the file is missing. A bad image build fails at startup, not on a visitor's request.
- The Databricks client is created lazily on the first `predict` call. Missing or blank `DATABRICKS_HOST` / `DATABRICKS_TOKEN` becomes `EmotionModelUnavailable` (503), not a crash at boot.

## Status codes

| Outcome | Status |
|---|---|
| Unsupported content type | 415 |
| Over 10 MB (header or body) | 413 |
| Invalid Content-Length | 400 |
| Unreadable or truncated image | 400 |
| No face detected | 422 |
| Emotion model not configured | 503 |
| Emotion model call failed | 502 |

Don't put internal error text (env var names, upstream messages) in the response `detail`; log it instead.

## Endpoint name

The serving endpoint is still named `emotional-identifier` on Databricks. It lives only in `DatabricksEmotionModel.ENDPOINT_NAME`; renaming it is a one-line change there.

## Adding a different kind of model

Give it its own feature module following this layout. Don't extract a shared Databricks client or a model base class until a second module needs one.
