/**
 * Identifies this app to Wikimedia per their User-Agent policy
 * (https://meta.wikimedia.org/wiki/User-Agent_policy). Browsers can't set
 * `User-Agent` from fetch, so Wikimedia accepts `Api-User-Agent` instead.
 * Anonymous, unidentified traffic from shared IPs is what gets throttled first.
 */
export const WIKIMEDIA_API_USER_AGENT =
  'SpotSpotter/2.0 (https://github.com/chirucristian/spot-spotter)';

const DEFAULT_RETRY_DELAY_MS = 1200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * fetch() wrapper for Wikimedia endpoints (Wikipedia, Wikidata, Commons, WDQS).
 *
 * Retries exactly once on a transient throttle:
 *  - HTTP 429 from the API layer, or
 *  - a thrown network error, which is how the edge's 429 page surfaces in
 *    browsers (it carries no CORS headers, so fetch rejects with TypeError).
 * Aborts are never retried.
 */
export async function wikimediaFetch(
  url: string,
  init: RequestInit = {},
  retryDelayMs = DEFAULT_RETRY_DELAY_MS
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Api-User-Agent', WIKIMEDIA_API_USER_AGENT);
  const request = () => fetch(url, { ...init, headers });

  try {
    const res = await request();
    if (res.status !== 429) return res;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  await sleep(retryDelayMs);
  return request();
}
