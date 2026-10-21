/**
 * Computes the screen pixel distance (dx, dy) between two coordinates
 * at a given zoom level using standard Web Mercator projection.
 */
export function computeScreenPixelDelta(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  zoom: number
): { dx: number; dy: number; dist: number } {
  const scale = 256 * Math.pow(2, zoom);

  const x1 = ((lng1 + 180) / 360) * scale;
  const siny1 = Math.sin((lat1 * Math.PI) / 180);
  const clampedSiny1 = Math.min(Math.max(siny1, -0.9999), 0.9999);
  const y1 = (0.5 - Math.log((1 + clampedSiny1) / (1 - clampedSiny1)) / (4 * Math.PI)) * scale;

  const x2 = ((lng2 + 180) / 360) * scale;
  const siny2 = Math.sin((lat2 * Math.PI) / 180);
  const clampedSiny2 = Math.min(Math.max(siny2, -0.9999), 0.9999);
  const y2 = (0.5 - Math.log((1 + clampedSiny2) / (1 - clampedSiny2)) / (4 * Math.PI)) * scale;

  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  return { dx, dy, dist };
}
