import { Landmark, LandmarkCategory } from '../types';

export interface MapBoundsBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

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
    t.includes('senate') ||
    t.includes('bank of') ||
    t.includes('station')
  ) {
    return {
      category: 'civic',
      catLabel: t.includes('palace')
        ? 'Palace'
        : t.includes('parliament')
        ? 'Parliament'
        : t.includes('city hall') || t.includes('town hall')
        ? 'City Hall'
        : 'Civic Landmark'
    };
  }
  if (
    t.includes('cathedral') ||
    t.includes('church') ||
    t.includes('abbey') ||
    t.includes('basilica') ||
    t.includes('chapel')
  ) {
    return { category: 'sacred', catLabel: t.includes('cathedral') ? 'Cathedral' : 'Sacred Landmark' };
  }
  if (t.includes('statue') || t.includes('monument') || t.includes('memorial') || t.includes('sculpture')) {
    return { category: 'culture', catLabel: 'Monument' };
  }
  if (t.includes('fountain')) {
    return { category: 'culture', catLabel: 'Fountain' };
  }
  if (t.includes('square') || t.includes('piazza') || t.includes('plaza') || t.includes('park') || t.includes('esplanade')) {
    return { category: 'culture', catLabel: t.includes('park') || t.includes('esplanade') ? 'Park' : 'Square' };
  }
  if (t.includes('museum') || t.includes('gallery') || t.includes('library') || t.includes('theatre') || t.includes('theater')) {
    return { category: 'culture', catLabel: t.includes('library') ? 'Library' : 'Museum & Culture' };
  }
  return { category: 'culture', catLabel: 'Landmark' };
}

/**
 * Computes a 1–100 prominence score for any Wikipedia landmark/building so that
 * zoomed-out views surface major city icons and zoomed-in views include local details.
 */
export function computeLandmarkImportance(
  title: string,
  description = '',
  extract = '',
  articleLength = 2500,
  hasThumbnail = false
): number {
  const text = `${title} ${description} ${extract.slice(0, 220)}`.toLowerCase();

  let score = Math.min(58, Math.max(12, Math.round(Math.sqrt(articleLength) / 2.6)));

  if (hasThumbnail) {
    score += 14;
  }

  if (
    /\b(cathedral|parliament|palace|castle|fortress|citadel|national|supreme court|central station|city hall|town hall|basilica|abbey|opera house)\b/.test(
      text
    )
  ) {
    score += 24;
  } else if (
    /\b(monument|statue|memorial|sculpture|fountain|square|piazza|plaza|museum|gallery|library|university|theatre|theater|church|bridge|arch|tower|esplanade|botanical)\b/.test(
      text
    )
  ) {
    score += 14;
  }

  return Math.max(15, Math.min(97, score));
}

function lerp(a: number, b: number, t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return a + (b - a) * clamped;
}

/**
 * Filters the pool of discovered landmarks based on the current map zoom level
 * and visible viewport bounds.
 */
export function filterLandmarksForZoomAndBounds(
  pool: Landmark[],
  zoom: number,
  bounds: MapBoundsBox | null,
  selectedId: string | null
): Landmark[] {
  let inView = pool;
  if (bounds) {
    const latMargin = Math.max(0.001, (bounds.north - bounds.south) * 0.12);
    const lngMargin = Math.max(0.001, (bounds.east - bounds.west) * 0.12);
    inView = pool.filter(
      (lm) =>
        lm.id === selectedId ||
        (lm.lat <= bounds.north + latMargin &&
          lm.lat >= bounds.south - latMargin &&
          lm.lng <= bounds.east + lngMargin &&
          lm.lng >= bounds.west - lngMargin)
    );
  }

  const t = (zoom - 13.5) / (18.0 - 13.5);

  const minImportance = Math.round(lerp(82, 0, t));
  const maxCount = Math.round(lerp(5, 32, t));
  const minSpacingMeters = Math.round(lerp(420, 8, t));

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
    if (imp < minImportance && picked.length >= 4) {
      continue;
    }

    const tooClose = picked.some(
      (existing) =>
        existing.id !== selectedId &&
        computeDistanceMeters(lm.lat, lm.lng, existing.lat, existing.lng) < minSpacingMeters
    );

    if (!tooClose) {
      picked.push(lm);
    }

    if (picked.length >= maxCount) break;
  }

  return picked;
}

/**
 * Strips noisy Wikipedia pronunciation/IPA blocks and empty parentheses so prose reads cleanly.
 */
function cleanWikiProse(raw: string): string {
  return raw
    .replace(/\s*\([^)]*(?:IPA|pronounced|\/[^/]+\/|;\s*[A-Za-z]+:)[^)]*\)/gi, '')
    .replace(/\s*\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoSentences(text: string): string[] {
  const protectedText = text
    .replace(/\b(St|Dr|Mr|Mrs|Ms|Prof|Jr|Sr|Rev|Gen|Col|Capt|Lt|Sgt|No|ca|cf|approx|est|vol|fig|inc|ltd)\.\s+/gi, '$1\u0000 ')
    .replace(/\b([A-Z])\.\s+/g, '$1\u0000 ');

  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘])/)
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter((s) => s.length > 22);
}

/**
 * Extracts the construction year or range (e.g., "1830–1852", "1757", "19th century")
 * from Wikipedia prose and short description.
 */
export function extractBuiltYear(text: string, description = ''): string {
  const combined = `${description} ${text}`;

  // 1. Explicit "between YYYY and YYYY" or "from YYYY to YYYY"
  const betweenMatch = combined.match(
    /\b(?:built|constructed|erected|completed|designed|created|begun|opened)?\s*(?:between|from)\s+(1[0-9]\d{2}|20[0-2]\d)\s+(?:and|to)\s+(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  if (betweenMatch) {
    return `${betweenMatch[1]}–${betweenMatch[2]}`;
  }

  // 2. Explicit verb + year or range: "built in 1757", "completed in 1852", "unveiled in 1908"
  const verbYearMatch = combined.match(
    /\b(?:built|constructed|completed|erected|opened|unveiled|founded|established|consecrated|inaugurated|rebuilt|restored|dates?\s+from|dating\s+to)\s+(?:in|around|c\.|ca\.)?\s*(?:[A-Z][a-z]+\s+(?:\d{1,2},?\s+)?)?(1[0-9]\d{2}|20[0-2]\d)(?:\s*[–—-]\s*(1[0-9]\d{2}|20[0-2]\d|\d{2}))?\b/i
  );
  if (verbYearMatch) {
    return verbYearMatch[2]
      ? `${verbYearMatch[1]}–${verbYearMatch[2]}`
      : verbYearMatch[1];
  }

  // 3. Explicit year range anywhere in description or opening text (e.g. "1830–1852")
  const rangeMatch = combined.match(
    /\b(1[0-9]\d{2}|20[0-2]\d)\s*[–—-]\s*(1[0-9]\d{2}|20[0-2]\d|\d{2})\b/
  );
  if (rangeMatch) {
    return `${rangeMatch[1]}–${rangeMatch[2]}`;
  }

  // 4. Single 4-digit year (1000–2029)
  const yearMatch = combined.match(/\b(1[0-9]\d{2}|20[0-2]\d)\b/);
  if (yearMatch) {
    return yearMatch[1];
  }

  // 5. Century mention (e.g. "18th century")
  const centuryMatch = combined.match(/\b(\d{1,2}(?:st|nd|rd|th)[- ]century)\b/i);
  if (centuryMatch) {
    return centuryMatch[1].replace('-', ' ');
  }

  return 'Historic';
}

/**
 * Parses a Wikipedia extract into a single `built` date string and a cohesive `summary`.
 */
export function parseRichWikipediaSummary(
  title: string,
  description: string | undefined,
  extract: string | undefined
): {
  built: string;
  summary: string;
} {
  const cleaned = cleanWikiProse(extract || '');
  const sentences = splitIntoSentences(cleaned);

  const cleanDesc = description
    ? description.charAt(0).toUpperCase() + description.slice(1).replace(/\.$/, '')
    : '';

  const summarySentences = sentences.slice(0, 5);
  const summary =
    summarySentences.length > 0
      ? summarySentences.join(' ')
      : cleanDesc
      ? `${title} — ${cleanDesc}.`
      : `${title} is a notable landmark in this area.`;

  const built = extractBuiltYear(cleaned, description);

  return {
    built,
    summary
  };
}

/**
 * Fetches the full Wikipedia introductory extract when a user selects a live landmark
 * so that live-spotted buildings have complete summaries and accurate construction dates.
 */
export async function fetchFullWikipediaEnrichment(
  wikiTitle: string,
  buildingName: string,
  existingDescription?: string
): Promise<Partial<Landmark> | null> {
  if (!wikiTitle) return null;
  try {
    const decodedTitle = decodeURIComponent(wikiTitle);
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|description&exintro=1&explaintext=1&titles=${encodeURIComponent(
      decodedTitle
    )}&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values<any>(data.query.pages) : [];
    const page = pages[0];
    if (!page || !page.extract) return null;

    const parsed = parseRichWikipediaSummary(
      buildingName,
      page.description || existingDescription,
      page.extract
    );

    return {
      built: parsed.built,
      summary: parsed.summary,
      enriched: true
    };
  } catch {
    return null;
  }
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
    } catch (_) {}
  }

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

  candidates.sort((a, b) => b.score - a.score);

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
