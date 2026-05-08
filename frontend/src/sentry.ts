/**
 * Initializes Sentry after first paint so the SDK + Replay
 * integration don't block hydration. Only runs in the browser
 * and only when a DSN is configured.
 */
export const initSentryDeferred = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof window === 'undefined') return;

  const start = () =>
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
      });
    });

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 4000 });
  } else {
    setTimeout(start, 2000);
  }
};
