export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Applied only when the caller passes no signal. React-query consumers supply
// the query's own abort signal; the bare call sites (contact form) are the
// ones that would otherwise hang forever on a stalled connection.
const DEFAULT_TIMEOUT_MS = 20_000;

// FastAPI validation errors (422) send `detail` as an array of
// {loc, msg, type} objects; anything non-string would stringify to
// "[object Object]" in the UI.
const errorDetail = (parsed: unknown, fallback: string): string => {
  if (parsed && typeof parsed === 'object') {
    const { detail, message } = parsed as { detail?: unknown; message?: unknown };
    if (typeof detail === 'string' && detail) return detail;
    if (Array.isArray(detail)) {
      const msgs = detail
        .map((item) => (item && typeof item === 'object' ? (item as { msg?: unknown }).msg : null))
        .filter((msg): msg is string => typeof msg === 'string');
      if (msgs.length) return msgs.join('; ');
    }
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
};

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T | undefined> => {
  const res = await fetch(path, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });
  if (!res.ok) {
    // Only read the body when the server signals JSON; otherwise the SPA
    // catch-all returns index.html for unknown paths and we'd surface the
    // entire HTML document as the "error detail".
    const ctype = res.headers.get('content-type') ?? '';
    let detail = res.statusText;
    if (ctype.includes('application/json')) {
      const parsed = await res.json().catch(() => null);
      detail = errorDetail(parsed, res.statusText);
    }
    throw new ApiError(res.status, `HTTP ${res.status}: ${detail}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined;
  }
  const ctype = res.headers.get('content-type') ?? '';
  if (!ctype.includes('application/json')) {
    return undefined;
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError(res.status, 'Invalid JSON in server response');
  }
};

export const apiFetchRequired = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const json = await apiFetch<T>(path, init);
  if (json === undefined) {
    throw new Error(`Empty response from ${path}`);
  }
  return json;
};
