export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T | undefined> => {
  const res = await fetch(path, init);
  if (!res.ok) {
    // Only read the body when the server signals JSON; otherwise the SPA
    // catch-all returns index.html for unknown paths and we'd surface the
    // entire HTML document as the "error detail".
    const ctype = res.headers.get('content-type') ?? '';
    let detail = res.statusText;
    if (ctype.includes('application/json')) {
      const parsed = await res.json().catch(() => null);
      detail = parsed?.detail || parsed?.message || res.statusText;
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
  return (await res.json()) as T;
};
