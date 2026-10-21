import { describe, expect, it } from 'vitest';
import {
  computeDistanceMeters,
  formatDistance,
  computeScreenPixelDelta,
  isInstitutionalEntity,
  formatStructuredBuiltYear,
  extractBuiltYear,
  parseRichWikipediaSummary,
  isArchitecturalBuilding,
  computeLandmarkImportance,
  filterLandmarksForZoomAndBounds,
  inferCategory,
  isUsableBuildingPhoto
} from '../src/utils/geo';
import { Landmark } from '../src/types';

describe('Geographic Distance & Formatting', () => {
  it('computes distance between two coordinates accurately', () => {
    // Helsinki Cathedral to Senate Square (~100m)
    const dist = computeDistanceMeters(60.1695, 24.9523, 60.1699, 24.9525);
    expect(dist).toBeGreaterThan(40);
    expect(dist).toBeLessThan(80);
  });

  it('formats distance correctly in meters and kilometers', () => {
    expect(formatDistance(45)).toBe('45 m');
    expect(formatDistance(650)).toBe('650 m');
    expect(formatDistance(1200)).toBe('1.2 km');
    expect(formatDistance(14800)).toBe('14.8 km');
  });
});

describe('Screen Pixel Delta Projection', () => {
  it('calculates screen pixel distance at a given zoom level', () => {
    const p1 = { lat: 47.6205, lng: -122.3493 }; // Space Needle
    const p2 = { lat: 47.6044, lng: -122.3306 }; // Columbia Center
    const delta12 = computeScreenPixelDelta(p1.lat, p1.lng, p2.lat, p2.lng, 12);
    const delta14 = computeScreenPixelDelta(p1.lat, p1.lng, p2.lat, p2.lng, 14);

    expect(delta14.dx).toBeCloseTo(delta12.dx * 4, -1);
    expect(delta14.dy).toBeCloseTo(delta12.dy * 4, -1);
  });
});

describe('Institutional Entity Detection', () => {
  it('identifies institutions and organizations correctly', () => {
    expect(isInstitutionalEntity('National Library of Romania', 'national library')).toBe(true);
    expect(isInstitutionalEntity('Harvard University', 'private research university')).toBe(true);
    expect(isInstitutionalEntity('British Museum', 'museum in London')).toBe(true);
    expect(isInstitutionalEntity('Bank of England', 'central bank')).toBe(true);
  });

  it('does not classify physical architectural structures as institutions', () => {
    expect(isInstitutionalEntity('The Shard', 'skyscraper in London')).toBe(false);
    expect(isInstitutionalEntity('Space Needle', 'observation tower')).toBe(false);
    expect(isInstitutionalEntity('Colosseum', 'amphitheatre in Rome')).toBe(false);
    expect(isInstitutionalEntity('Helsinki Cathedral', 'cathedral in Helsinki')).toBe(false);
  });
});

describe('Structured Built Year Formatting', () => {
  it('formats physical building inception timestamps', () => {
    expect(formatStructuredBuiltYear('+1962-00-00T00:00:00Z', undefined, false)).toBe('1962');
    expect(formatStructuredBuiltYear('+1961-00-00T00:00:00Z', '+1962-00-00T00:00:00Z', false)).toBe('1961–1962');
  });

  it('rejects institutional inception for organizations', () => {
    // 1859 is National Library institution founding, not building construction
    expect(formatStructuredBuiltYear('+1859-00-00T00:00:00Z', undefined, true)).toBeUndefined();
    // But accepts official opening date of current building if available
    expect(formatStructuredBuiltYear('+1859-00-00T00:00:00Z', '+2012-00-00T00:00:00Z', true)).toBe('2012');
  });
});

describe('Text Built Year Extraction', () => {
  it('extracts multi-sentence construction start and completion', () => {
    const text =
      'In 1986, a new, larger location began to be built for the library. The project was completed the construction in 2011 and opened in 2012.';
    expect(extractBuiltYear(text, 'national library', 'National Library of Romania')).toBe('1986–2011');
  });

  it('extracts explicit between and from-to ranges', () => {
    expect(extractBuiltYear('The cathedral was built between 1830 and 1852.')).toBe('1830–1852');
    expect(extractBuiltYear('Constructed from 1887 to 1889 for the exposition.')).toBe('1887–1889');
  });

  it('extracts single completion or construction year', () => {
    expect(extractBuiltYear('The tower was completed in 1962.')).toBe('1962');
  });

  it('rejects bare institutional predecessor opening dates', () => {
    const text = 'Saint Sava College library was opened in 1859.';
    expect(extractBuiltYear(text, 'national library', 'National Library of Romania')).toBeUndefined();
  });
});

describe('Wikipedia Summary Parsing', () => {
  it('parses lead section into summary and extracts built year from full text', () => {
    const text = `The National Library of Romania is located at 22 Unirii Boulevard in central Bucharest. It is intended to be the repository of all that is published in Romania. The construction cost was €110 million.

== History ==
The roots of the library can be found in Saint Sava College library. Saint Sava College library was opened in 1859.

== New building ==
In 1986, a new, larger location began to be built for the library. The Ministry completed the construction in 2011.`;

    const parsed = parseRichWikipediaSummary(
      'National Library of Romania',
      'national library',
      text
    );

    expect(parsed.summary).toContain('22 Unirii Boulevard');
    expect(parsed.summary).not.toContain('== History ==');
    expect(parsed.built).toBe('1986–2011');
  });
});

describe('Building Physical Filtering', () => {
  it('keeps genuine physical buildings, monuments, statues and fountains', () => {
    expect(isArchitecturalBuilding('The Shard', 'skyscraper in Southwark, London')).toBe(true);
    expect(isArchitecturalBuilding('Space Needle', 'observation tower in Seattle')).toBe(true);
    expect(isArchitecturalBuilding('Havis Amanda', 'fountain and bronze sculpture in Helsinki')).toBe(true);
    expect(isArchitecturalBuilding('Lumen Field', 'stadium in Seattle')).toBe(true);
  });

  it('rejects institutions, companies, government bodies, districts and events', () => {
    expect(isArchitecturalBuilding('Microsoft', 'American multinational technology corporation')).toBe(false);
    expect(isArchitecturalBuilding('Ministry of Culture', 'government ministry of Romania')).toBe(false);
    expect(isArchitecturalBuilding('Seattle City Council', 'legislative body of Seattle')).toBe(false);
    expect(isArchitecturalBuilding('Capitol Hill', 'neighborhood in Seattle')).toBe(false);
    expect(isArchitecturalBuilding('Colectiv nightclub fire', 'fire in Bucharest')).toBe(false);
  });
});

describe('Landmark Importance Ranking', () => {
  it('ranks high-profile landmarks higher based on sitelinks and keywords', () => {
    const spaceNeedleScore = computeLandmarkImportance('Space Needle', 'observation tower', '', 5000, true, 45);
    const officeScore = computeLandmarkImportance('1201 Third Avenue', 'office skyscraper', '', 1500, true, 5);

    expect(spaceNeedleScore).toBeGreaterThan(85);
    expect(spaceNeedleScore).toBeGreaterThan(officeScore);
  });
});

describe('Zoom and Bounds Landmark Density Control', () => {
  const mockPool: Landmark[] = [
    {
      id: 'needle',
      name: 'Space Needle',
      role: 'Observation Tower',
      category: 'civic',
      lat: 47.6205,
      lng: -122.3493,
      importance: 95,
      summary: ''
    },
    {
      id: 'third-ave',
      name: '1201 Third Avenue',
      role: 'Skyscraper',
      category: 'civic',
      lat: 47.6074,
      lng: -122.335,
      importance: 68,
      summary: ''
    },
    {
      id: 'columbia',
      name: 'Columbia Center',
      role: 'Skyscraper',
      category: 'civic',
      lat: 47.6044,
      lng: -122.3306,
      importance: 84,
      summary: ''
    }
  ];

  it('suppresses low-importance and crowded landmarks at zoomed out metropolitan view (zoom 12)', () => {
    const visible = filterLandmarksForZoomAndBounds(mockPool, 12.2, null, null);
    const ids = visible.map((l) => l.id);

    expect(ids).toContain('needle');
    expect(ids).not.toContain('third-ave');
    expect(visible.length).toBeLessThanOrEqual(2);
  });

  it('reveals more landmarks as zoom increases to street level', () => {
    const visibleZoom16 = filterLandmarksForZoomAndBounds(mockPool, 16.5, null, null);
    expect(visibleZoom16.length).toBeGreaterThan(1);
  });

  it('always includes selected landmark regardless of zoom and importance', () => {
    const visible = filterLandmarksForZoomAndBounds(mockPool, 10.0, null, 'third-ave');
    expect(visible.map((l) => l.id)).toContain('third-ave');
  });
});

describe('Category and Photo Heuristics', () => {
  it('infers categories appropriately', () => {
    expect(inferCategory('Helsinki Cathedral', 'cathedral').category).toBe('sacred');
    expect(inferCategory('Supreme Court', 'courthouse').category).toBe('law');
    expect(inferCategory('City Hall', 'civic building').category).toBe('civic');
    expect(inferCategory('Museum of Art', 'art museum').category).toBe('culture');
  });

  it('distinguishes usable exterior photos from junk/diagrams', () => {
    expect(isUsableBuildingPhoto('https://example.com/building_exterior.jpg')).toBe(true);
    expect(isUsableBuildingPhoto('https://example.com/logo.svg')).toBe(false);
    expect(isUsableBuildingPhoto('https://example.com/floor_plan.png')).toBe(false);
    expect(isUsableBuildingPhoto('https://example.com/coat_of_arms.png')).toBe(false);
  });
});
