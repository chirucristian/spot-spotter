import { LandmarkCategory } from '../types';

export function computeDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function formatDistance(meters: number): string {
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`;
}

export function inferCategory(title: string, desc = ''): { category: LandmarkCategory; catLabel: string } {
  const t = `${title} ${desc}`.toLowerCase();
  if (t.includes('court') || t.includes('justice') || t.includes('law') || t.includes('tribunal') || t.includes('university')) {
    return { category: 'law', catLabel: t.includes('university') ? 'University' : 'House of Law' };
  }
  if (
    t.includes('parliament') ||
    t.includes('palace') ||
    t.includes('ministry') ||
    t.includes('government') ||
    t.includes('city hall') ||
    t.includes('town hall') ||
    t.includes('senate')
  ) {
    return { category: 'civic', catLabel: 'Civic Building' };
  }
  if (
    t.includes('cathedral') ||
    t.includes('church') ||
    t.includes('abbey') ||
    t.includes('basilica') ||
    t.includes('chapel')
  ) {
    return { category: 'sacred', catLabel: 'Sacred' };
  }
  return { category: 'culture', catLabel: 'Landmark' };
}

/**
 * Split a Wikipedia multi-sentence extract into a punchy 1-sentence hook,
 * a rich multi-sentence overview, and 2-3 readable key takeaway bullets.
 */
export function parseRichWikipediaSummary(
  title: string,
  description: string | undefined,
  extract: string | undefined
): {
  whyItMatters: string;
  styleAndEra: string;
  architect: string;
  summary: string;
  highlights: string[];
} {
  const cleanExtract = (extract || '').replace(/\s+/g, ' ').trim();
  const sentences = cleanExtract
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const firstSentence =
    sentences[0] ||
    (description
      ? `${title} is a ${description}.`
      : `${title} is a prominent architectural landmark at this square.`);

  const bodySentences = sentences.slice(1, 5);
  const summaryText =
    bodySentences.length > 0 ? bodySentences.join(' ') : cleanExtract || firstSentence;

  const extraBullets = sentences.slice(2, 5);
  const highlights =
    extraBullets.length >= 2
      ? extraBullets
      : [
          description
            ? `Recognized as: ${description.charAt(0).toUpperCase() + description.slice(1)}.`
            : `Prominent architectural structure in the immediate square.`,
          sentences[1] || firstSentence
        ].filter(Boolean);

  // Extract a year or century if mentioned in the text
  const yearMatch = cleanExtract.match(/\b(1[1-9]\d{2}|20[0-2]\d)\b/);
  const styleAndEra = yearMatch ? `Historic Landmark · Est. ${yearMatch[1]}` : 'Architectural Landmark';

  return {
    whyItMatters: firstSentence,
    styleAndEra,
    architect: description ? description.charAt(0).toUpperCase() + description.slice(1) : 'Civic Architecture',
    summary: summaryText,
    highlights
  };
}
