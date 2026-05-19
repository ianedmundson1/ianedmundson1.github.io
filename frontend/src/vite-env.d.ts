/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ENABLE_EMOTION_DEMO?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
