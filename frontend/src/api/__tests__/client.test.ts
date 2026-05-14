import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch } from '../client';

const mockFetch = (status: number, body: unknown, headers: Record<string, string> = {}) => {
  const res = new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
};

describe('apiFetch', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('parses a JSON 200 response', async () => {
    mockFetch(200, { ok: true });
    const data = await apiFetch<{ ok: boolean }>('/api/x');
    expect(data).toEqual({ ok: true });
  });

  it('returns undefined on 204 No Content instead of throwing on empty body', async () => {
    const res = new Response(null, { status: 204 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
    const data = await apiFetch<undefined>('/api/empty');
    expect(data).toBeUndefined();
  });

  it('returns undefined when content-type is not JSON', async () => {
    const res = new Response('plain text', {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
    const data = await apiFetch<undefined>('/api/text');
    expect(data).toBeUndefined();
  });

  it('throws ApiError with detail from JSON error body', async () => {
    mockFetch(400, { detail: 'bad input' });
    await expect(apiFetch('/api/x')).rejects.toBeInstanceOf(ApiError);
    await expect(apiFetch('/api/x')).rejects.toMatchObject({ status: 400, message: /bad input/ });
  });
});
