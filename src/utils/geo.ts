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

const JUNK_IMAGE_PATTERNS =
  /\.(svg|gif|png|tif|tiff|ogg|webm|pdf)(\?|$)|coat_of_arms|wappen|blason|stema|flag_of|logo|icon|locator|location_map|_map|plan_of|floor_plan|footprint|grundriss|cross_section|diagram|signature|autograph|stamp|coin|medal|portrait_of|bust_of|tomb_of|grave_of|plaque|engraving|lithograph|etching|sketch|luonnos|alkuperäispiirustus|pianta_del|collage|tapestry|bayeux|kirkko3|ceausescu|ceaușescu|bourdon|martyrdom|caravaggio|botticelli|canaletto/i;

const EXTERIOR_CUES =
  /exterior|facade|façade|outside|external|front|view|veduta|square|piazza|piata|piața|place|platz|plaza|aerial|ilmakuva|sky-foto|panoram|seen_from|from_the|from_westminster|main_building|päärakennus|talo|linna|palatul|catedrala|westminster_station|town_hall|townhall|stadhuis|hotel_de_ville|maison_du_roi|ducs_de_brabant|tribunale|loggia_dei_lanzi|uffizi|guildhall|supreme_court/i;

const INTERIOR_OR_DETAIL_CUES =
  /interior|inside|indoor|hall|sala|salone|room|chamber|chapel|crypt|nave|naos|choir|altar|pulpit|organ|ceiling|vault|fresco|mosaic|stained_glass|window|staircase|stairs|lobby|corridor|cafe|library_-_1|courtroom|statue|sculpture|detail|relief|cristogramma|virtù|portalini|bunker|cellar/i;

export function isUsableBuildingPhoto(urlOrTitle: string, caption = ''): boolean {
  if (!urlOrTitle) return false;
  const combined = `${decodeURIComponent(urlOrTitle)} ${caption}`;
  return !JUNK_IMAGE_PATTERNS.test(combined);
}

export function scoreExteriorPhoto(
  urlOrTitle: string,
  caption: string,
  buildingName: string,
  isLead = false
): number {
  const text = `${decodeURIComponent(urlOrTitle)} ${caption}`.toLowerCase();
  let score = 0;

  if (EXTERIOR_CUES.test(text)) {
    score += 55;
  }

  const nameTokens = buildingName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const matchedTokens = nameTokens.filter((tok) => text.includes(tok));
  score += matchedTokens.length * 14;

  if (INTERIOR_OR_DETAIL_CUES.test(text)) {
    score -= 65;
  } else if (isLead) {
    score += 25;
  }

  return score;
}

function normalizePhotoKey(url: string): string {
  try {
    const clean = decodeURIComponent(url.split('?')[0]);
    const parts = clean.split('/');
    const last = parts[parts.length - 1] || clean;
    return last.replace(/^\d+px-/, '').toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/**
 * Fetches an ordered array of building photos for the carousel, guaranteeing
 * that the first picture (index 0) is an outside/exterior shot whenever available.
 */
export async function fetchBuildingPhotoGallery(
  wikiTitle: string,
  buildingName: string,
  curatedPhotos?: string[],
  fallbackImg?: string
): Promise<string[]> {
  const lockedExteriorFirst =
    curatedPhotos && curatedPhotos.length > 0 ? curatedPhotos[0] : undefined;

  const candidates: Array<{ url: string; score: number }> = [];

  if (curatedPhotos && curatedPhotos.length > 0) {
    curatedPhotos.forEach((url, idx) => {
      candidates.push({ url, score: 200 - idx * 10 });
    });
  } else if (fallbackImg && isUsableBuildingPhoto(fallbackImg)) {
    candidates.push({
      url: fallbackImg,
      score: scoreExteriorPhoto(fallbackImg, '', buildingName, true)
    });
  }

  // 1. Query Wikipedia REST media-list for article photos
  if (wikiTitle) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/media-list/${wikiTitle}`
      );
      if (res.ok) {
        const data = await res.json();
        const items: any[] = Array.isArray(data?.items) ? data.items : [];
        items.forEach((item, idx) => {
          if (item.type !== 'image' || item.showInGallery === false) return;
          const title = item.title || '';
          const caption = item.caption?.text || '';
          if (!isUsableBuildingPhoto(title, caption)) return;

          const srcset = Array.isArray(item.srcset) ? item.srcset : [];
          const bestSrc = srcset[srcset.length - 1]?.src || item.src;
          if (!bestSrc) return;

          const fullUrl = bestSrc.startsWith('//')
            ? `https:${bestSrc.split('?')[0]}`
            : bestSrc.split('?')[0];

          if (!isUsableBuildingPhoto(fullUrl, caption)) return;

          const score = scoreExteriorPhoto(
            `${title} ${fullUrl}`,
            caption,
            buildingName,
            idx === 0 || item.section_id === 0
          );
          candidates.push({ url: fullUrl, score });
        });
      }
    } catch (_) {
      // Ignore network errors and fall back to existing candidates
    }
  }

  // 2. If we still have fewer than 3 photos, supplement from Wikimedia Commons search
  if (candidates.length < 3 && buildingName) {
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
        `filetype:bitmap ${buildingName}`
      )}&gsrlimit=6&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json&origin=*`;
      const res = await fetch(commonsUrl);
      if (res.ok) {
        const data = await res.json();
        const pages: any[] = data?.query?.pages ? Object.values(data.query.pages) : [];
        pages.forEach((p) => {
          const title = p.title || '';
          const thumbUrl = (p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url || '').split('?')[0];
          if (!thumbUrl || !isUsableBuildingPhoto(title, thumbUrl)) return;
          const score = scoreExteriorPhoto(title, '', buildingName, false);
          candidates.push({ url: thumbUrl, score });
        });
      }
    } catch (_) {}
  }

  // Sort highest exterior score first
  candidates.sort((a, b) => b.score - a.score);

  // Deduplicate by normalized filename while keeping lockedExteriorFirst at index 0
  const result: string[] = [];
  const seenKeys = new Set<string>();

  if (lockedExteriorFirst) {
    result.push(lockedExteriorFirst);
    seenKeys.add(normalizePhotoKey(lockedExteriorFirst));
  }

  for (const c of candidates) {
    const key = normalizePhotoKey(c.url);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(c.url);
    }
    if (result.length >= 6) break;
  }

  if (result.length === 0 && fallbackImg) {
    return [fallbackImg];
  }

  return result;
}
