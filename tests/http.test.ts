import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WIKIMEDIA_API_USER_AGENT, wikimediaFetch } from '../src/services/http';
import { fetchWikipediaGeosearchAround } from '../src/services/wikipedia';

const ok = (body: unknown = {}) => ({ ok: true, status: 200, json: async () => body }) as any;
const tooMany = () => ({ ok: false, status: 429, json: async () => ({}) }) as any;

describe('wikimediaFetch (rate-limit resilience)', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.restoreAllMocks());

  it('identifies the app via Api-User-Agent on every request', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(ok());
    await wikimediaFetch('https://en.wikipedia.org/w/api.php', { headers: { Accept: 'x' } }, 0);
    const init = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(headers.get('Api-User-Agent')).toBe(WIKIMEDIA_API_USER_AGENT);
    expect(headers.get('Accept')).toBe('x');
  });

  it('does not retry a successful response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(ok());
    await wikimediaFetch('u', {}, 0);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('retries once after HTTP 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(tooMany()).mockResolvedValueOnce(ok({ a: 1 }));
    const res = await wikimediaFetch('u', {}, 0);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(await res.json()).toEqual({ a: 1 });
  });

  it('retries once after a network error (edge 429 without CORS headers)', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(ok());
    const res = await wikimediaFetch('u', {}, 0);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(res.ok).toBe(true);
  });

  it('gives up after one retry and returns the 429', async () => {
    vi.mocked(fetch).mockResolvedValue(tooMany());
    const res = await wikimediaFetch('u', {}, 0);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(429);
  });

  it('never retries an aborted request', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    vi.mocked(fetch).mockRejectedValueOnce(abort);
    await expect(wikimediaFetch('u', {}, 0)).rejects.toThrow('aborted');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('fetchWikipediaGeosearchAround error handling', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.restoreAllMocks());

  it('rejects with a clear error when Wikipedia keeps throttling', async () => {
    vi.useFakeTimers();
    vi.mocked(fetch).mockResolvedValue(tooMany());
    const p = fetchWikipediaGeosearchAround(47.6, -122.3, 1000);
    const assertion = expect(p).rejects.toThrow('Wikipedia geosearch error: 429');
    await vi.runAllTimersAsync();
    await assertion;
    vi.useRealTimers();
  });
});
