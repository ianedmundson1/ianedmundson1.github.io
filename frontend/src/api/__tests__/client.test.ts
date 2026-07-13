import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch, apiFetchRequired } from '../client';

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

  it('joins msg fields when a 422 sends detail as an array (FastAPI validation)', async () => {
    mockFetch(422, {
      detail: [
        { loc: ['body', 'email'], msg: 'field required', type: 'missing' },
        { loc: ['body', 'name'], msg: 'value too short', type: 'string_too_short' },
      ],
    });
    await expect(apiFetch('/api/x')).rejects.toThrow(/field required; value too short/);
  });

  it('throws a friendly ApiError when a 200 body is not valid JSON', async () => {
    const res = new Response('{"truncated":', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
    await expect(apiFetch('/api/x')).rejects.toMatchObject({
      name: 'ApiError',
      message: /Invalid JSON/,
    });
  });

  it('passes a timeout signal to fetch when the caller supplies none', async () => {
    mockFetch(200, { ok: true });
    await apiFetch('/api/x');
    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('keeps the caller-provided signal instead of the default timeout', async () => {
    mockFetch(200, { ok: true });
    const controller = new AbortController();
    await apiFetch('/api/x', { signal: controller.signal });
    const fetchMock = vi.mocked(fetch);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.signal).toBe(controller.signal);
  });
});

describe('apiFetchRequired', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('resolves with the parsed body on a JSON 200', async () => {
    mockFetch(200, { ok: true });
    const data = await apiFetchRequired<{ ok: boolean }>('/api/x');
    expect(data).toEqual({ ok: true });
  });

  it('rejects with "Empty response" on 204 No Content', async () => {
    const res = new Response(null, { status: 204 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res));
    await expect(apiFetchRequired('/api/empty')).rejects.toThrow(
      'Empty response from /api/empty',
    );
  });
});
