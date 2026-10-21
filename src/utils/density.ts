import { Landmark, MapBoundsBox } from '../types';
import { computeScreenPixelDelta } from './projection';

/**
 * Filters the pool of discovered landmarks based on the current map zoom level
 * and visible viewport bounds, strictly preventing label crowding when zoomed out.
 */
export function filterLandmarksForZoomAndBounds(
  pool: Landmark[],
  zoom: number,
  bounds: MapBoundsBox | null,
  selectedId: string | null
): Landmark[] {
  // If zoomed way out (zoom < 11.5), hide unselected rooftop pills completely to prevent clutter
  if (zoom < 11.5) {
    if (selectedId) {
      const selected = pool.find((l) => l.id === selectedId);
      return selected ? [selected] : [];
    }
    return [];
  }

  let inView = pool;
  if (bounds) {
    const latMargin = Math.max(0.001, (bounds.north - bounds.south) * 0.1);
    const lngMargin = Math.max(0.001, (bounds.east - bounds.west) * 0.1);
    inView = pool.filter(
      (lm) =>
        lm.id === selectedId ||
        (lm.lat <= bounds.north + latMargin &&
          lm.lat >= bounds.south - latMargin &&
          lm.lng <= bounds.east + lngMargin &&
          lm.lng >= bounds.west - lngMargin)
    );
  }

  // Adaptive density controls: when zoomed out, allow only high-fame icons and enforce wide pixel clearance
  let minImportance: number;
  let maxCount: number;
  let minPixelRadiusX: number;
  let minPixelRadiusY: number;

  if (zoom < 12.8) {
    // Zoom 11.5 - 12.8: Metropolitan overview (e.g. Seattle whole-city view)
    // Only show top 1-2 tier-1 city icons (e.g. Space Needle)
    minImportance = 86;
    maxCount = 2;
    minPixelRadiusX = 140;
    minPixelRadiusY = 65;
  } else if (zoom < 14.0) {
    // Zoom 12.8 - 14.0: Broad city overview
    minImportance = 78;
    maxCount = 4;
    minPixelRadiusX = 120;
    minPixelRadiusY = 50;
  } else if (zoom < 15.2) {
    // Zoom 14.0 - 15.2: District / Multi-neighborhood view
    minImportance = 68;
    maxCount = 8;
    minPixelRadiusX = 95;
    minPixelRadiusY = 38;
  } else if (zoom < 16.5) {
    // Zoom 15.2 - 16.5: Neighborhood / Downtown view
    minImportance = 50;
    maxCount = 16;
    minPixelRadiusX = 70;
    minPixelRadiusY = 28;
  } else if (zoom < 17.8) {
    // Zoom 16.5 - 17.8: Civic square / Street view
    minImportance = 25;
    maxCount = 24;
    minPixelRadiusX = 45;
    minPixelRadiusY = 20;
  } else {
    // Zoom 17.8+: Rooftop footprint level
    minImportance = 0;
    maxCount = 32;
    minPixelRadiusX = 28;
    minPixelRadiusY = 14;
  }

  const sorted = [...inView].sort((a, b) => {
    if (a.id === selectedId) return -1;
    if (b.id === selectedId) return 1;
    return (b.importance ?? 60) - (a.importance ?? 60);
  });

  const picked: Landmark[] = [];

  for (const lm of sorted) {
    if (lm.id === selectedId) {
      picked.push(lm);
      continue;
    }

    const imp = lm.importance ?? 60;
    if (imp < minImportance) {
      continue;
    }

    // Screen pixel clearance check against already picked higher-importance landmarks
    const collides = picked.some((existing) => {
      if (existing.id === selectedId) return false;
      const { dx, dy } = computeScreenPixelDelta(lm.lat, lm.lng, existing.lat, existing.lng, zoom);
      const nx = dx / minPixelRadiusX;
      const ny = dy / minPixelRadiusY;
      return nx * nx + ny * ny < 1.0;
    });

    if (!collides) {
      picked.push(lm);
    }

    if (picked.length >= maxCount) break;
  }

  return picked;
}
