const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, init);
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
  return res.json() as Promise<T>;
};
