import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchWikidataRankedLandmarks,
  fetchFullWikipediaEnrichment,
  fetchBuildingPhotoGallery
} from '../src/utils/geo';

describe('Data Fetching & API Enrichment', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchWikidataRankedLandmarks handles non-ok response gracefully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503
    } as any);

    await expect(fetchWikidataRankedLandmarks(47.6, -122.3, 1000)).rejects.toThrow(
      'Wikidata SPARQL error: 503'
    );
  });

  it('fetchWikidataRankedLandmarks parses Wikidata response correctly', async () => {
    const mockSparqlData = {
      results: {
        bindings: [
          {
            item: { value: 'http://www.wikidata.org/entity/Q186436' },
            itemLabel: { value: 'Space Needle' },
            itemDescription: { value: 'observation tower in Seattle' },
            coord: { value: 'Point(-122.3493 47.6205)' },
            sitelinks: { value: '45' },
            inception: { value: '+1962-00-00T00:00:00Z' },
            image: { value: 'https://commons.wikimedia.org/wiki/Special:FilePath/Space_Needle.jpg' }
          }
        ]
      }
    };

    const mockWbData = {
      entities: {
        Q186436: {
          sitelinks: {
            enwiki: { title: 'Space Needle' }
          }
        }
      }
    };

    const mockWpData = {
      query: {
        pages: {
          '12345': {
            pageid: 12345,
            title: 'Space Needle',
            extract: 'The Space Needle is an observation tower in Seattle, Washington, United States.',
            description: 'observation tower in Seattle',
            thumbnail: { source: 'https://example.com/thumb.jpg' }
          }
        }
      }
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => mockSparqlData } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockWbData } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockWpData } as any);

    const landmarks = await fetchWikidataRankedLandmarks(47.6205, -122.3493, 1000);

    expect(landmarks.length).toBe(1);
    expect(landmarks[0].name).toBe('Space Needle');
    expect(landmarks[0].built).toBe('1962');
    expect(landmarks[0].importance).toBeGreaterThan(85);
  });

  it('fetchFullWikipediaEnrichment extracts rich content and Wikidata claims', async () => {
    const mockWpData = {
      query: {
        pages: {
          '999': {
            pageid: 999,
            title: 'Helsinki Cathedral',
            extract: 'Helsinki Cathedral was built between 1830 and 1852 in neoclassical style.',
            pageprops: { wikibase_item: 'Q113333' }
          }
        }
      }
    };

    const mockWdData = {
      entities: {
        Q113333: {
          claims: {
            P571: [{ mainsnak: { datavalue: { value: { time: '+1830-00-00T00:00:00Z' } } } }],
            P1619: [{ mainsnak: { datavalue: { value: { time: '+1852-00-00T00:00:00Z' } } } }]
          }
        }
      }
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => mockWpData } as any)
      .mockResolvedValueOnce({ ok: true, json: async () => mockWdData } as any);

    const enriched = await fetchFullWikipediaEnrichment('Helsinki_Cathedral', 'Helsinki Cathedral');

    expect(enriched).not.toBeNull();
    expect(enriched?.built).toBe('1830–1852');
    expect(enriched?.enriched).toBe(true);
  });
});
