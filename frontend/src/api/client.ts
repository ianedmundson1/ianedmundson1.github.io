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
    const text = await res.text();
    let detail = text;
    try {
      const parsed = JSON.parse(text);
      detail = parsed.detail || parsed.message || text;
    } catch {
      /* response was not JSON */
    }
    throw new ApiError(res.status, `HTTP ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
};
