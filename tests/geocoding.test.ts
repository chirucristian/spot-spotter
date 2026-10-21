import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPULAR_CITIES, searchCities } from '../src/services/geocoding';

describe('Geocoding Service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides default popular cities list', () => {
    expect(POPULAR_CITIES.length).toBeGreaterThan(0);
    expect(POPULAR_CITIES.some((c) => c.name === 'Seattle')).toBe(true);
    expect(POPULAR_CITIES.some((c) => c.name === 'Helsinki')).toBe(true);
  });

  it('returns empty array when query is under 2 characters without calling fetch', async () => {
    const res = await searchCities('a');
    expect(res).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('parses Open-Meteo search results accurately', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 5809844,
            name: 'Seattle',
            latitude: 47.60621,
            longitude: -122.33207,
            country_code: 'US',
            admin1: 'Washington',
            country: 'United States'
          }
        ]
      })
    } as any);

    const results = await searchCities('Seattle');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Seattle');
    expect(results[0].admin1).toBe('Washington');
    expect(results[0].countryCode).toBe('US');
    expect(results[0].lat).toBe(47.60621);
    expect(results[0].lng).toBe(-122.33207);
  });
});
