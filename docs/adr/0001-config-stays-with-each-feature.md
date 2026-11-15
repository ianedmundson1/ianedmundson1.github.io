---
status: accepted
---

# Backend configuration stays with each feature

Each backend feature module reads its own environment settings, lazily, and reports what is missing through its own `missing_config()`. The readiness endpoint asks each feature and returns a per-feature status. There is no central configuration module. Decided in the spec in issue #23 and confirmed on 2026-11-14, when an architecture review proposed one.

We chose this because configuration knowledge then sits beside the code that uses it, a missing secret stays a 503 on the affected feature's requests instead of a crash at boot, and the app entry point never learns a feature's env var names.

## Considered options

- **One central configuration module** that owns every env read and hands each feature its settings. Rejected: it pulls each feature's knowledge away from the feature, and a module that validates everything in one place pushes toward failing at startup, which `backend/emotion/CLAUDE.md` ("Lifecycles differ on purpose") rules out.

## Consequences

- "Absent or blank" is decided per feature, so each feature's tests must cover blank values.
- The env examples are the only cross-feature list of settings. Issue #30 adds a test that keeps them in step with what the code reads.
