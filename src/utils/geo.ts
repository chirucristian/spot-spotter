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

export function computeBearingDegrees(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return Math.round((toDeg(Math.atan2(y, x)) + 360) % 360);
}

export function formatCompassBearing(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(((degrees % 360) / 45)) % 8;
  return `${dirs[idx]} · ${degrees}°`;
}

export function formatCardinalDirection(degrees: number): string {
  const dirs = [
    'North',
    'North-East',
    'East',
    'South-East',
    'South',
    'South-West',
    'West',
    'North-West'
  ];
  const idx = Math.round(((degrees % 360) / 45)) % 8;
  return dirs[idx];
}

export function formatWalkTime(meters: number): string {
  if (meters < 45) return '<1 min walk';
  const mins = Math.max(1, Math.round(meters / 78));
  return mins <= 25 ? `~${mins} min walk` : `${(meters / 1000).toFixed(1)} km away`;
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

  // Base prominence from Wikipedia article byte length (roughly 12..58)
  let score = Math.min(58, Math.max(12, Math.round(Math.sqrt(articleLength) / 2.6)));

  if (hasThumbnail) {
    score += 14;
  }

  // Major city/national landmark keywords
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
 * and visible viewport bounds:
 * - Zoomed in (zoom >= 17.5): includes everything in the area (buildings, statues, fountains, local landmarks)
 * - Zoomed out (zoom <= 13.5): includes only the most important headline landmarks in the view
 * - In between (zoom 13.5..17.5): smoothly interpolates minimum importance, max count, and spacing
 */
export function filterLandmarksForZoomAndBounds(
  pool: Landmark[],
  zoom: number,
  bounds: MapBoundsBox | null,
  selectedId: string | null
): Landmark[] {
  // 1. Filter to current viewport bounds (with a small 12% margin so edge pills don't pop)
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

  // 2. Compute smooth zoom-interpolation factor t in [0, 1] from zoom 13.5 (zoomed out) to 18.0 (zoomed in)
  const t = (zoom - 13.5) / (18.0 - 13.5);

  const minImportance = Math.round(lerp(82, 0, t));
  const maxCount = Math.round(lerp(5, 32, t));
  const minSpacingMeters = Math.round(lerp(420, 8, t));

  // Sort by importance descending (keeping selected landmark first if present)
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
    // Allow slightly lower-importance items only if we haven't even reached 4 landmarks in view
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
  // Protect common abbreviations and single-letter initials before splitting
  const protectedText = text
    .replace(/\b(St|Dr|Mr|Mrs|Ms|Prof|Jr|Sr|Rev|Gen|Col|Capt|Lt|Sgt|No|ca|cf|approx|est|vol|fig|inc|ltd)\.\s+/gi, '$1\u0000 ')
    .replace(/\b([A-Z])\.\s+/g, '$1\u0000 ');

  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘])/)
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter((s) => s.length > 22);
}

function extractStyleAndEra(text: string, description = ''): string {
  const combined = `${description} ${text}`;
  const stylePatterns: Array<[RegExp, string]> = [
    [/\b(neoclassical|neo-classical|empire style)\b/i, 'Neoclassical'],
    [/\b(gothic revival|neo-gothic|neogothic)\b/i, 'Gothic Revival'],
    [/\b(perpendicular gothic|brabantine gothic|florentine gothic|gothic)\b/i, 'Gothic'],
    [/\b(baroque revival|edwardian baroque|baroque)\b/i, 'Baroque'],
    [/\b(neo-renaissance|renaissance revival|mannerist|renaissance)\b/i, 'Renaissance'],
    [/\b(art nouveau|jugendstil|national romantic)\b/i, 'Art Nouveau / National Romantic'],
    [/\b(art deco)\b/i, 'Art Deco'],
    [/\b(neo-byzantine|byzantine)\b/i, 'Byzantine'],
    [/\b(russian revival)\b/i, 'Russian Revival'],
    [/\b(rococo)\b/i, 'Rococo Classicism'],
    [/\b(romanesque)\b/i, 'Romanesque'],
    [/\b(brutalist|brutalism)\b/i, 'Brutalist'],
    [/\b(modernist|functionalist|functionalism|contemporary|high-tech)\b/i, 'Modernist']
  ];

  let matchedStyle = '';
  for (const [regex, label] of stylePatterns) {
    if (regex.test(combined)) {
      matchedStyle = label;
      break;
    }
  }

  // Match year range like 1830–1852 or single completion year like 1852
  const rangeMatch = combined.match(/\b(1[1-9]\d{2}|20[0-2]\d)\s*[–—-]\s*(1[1-9]\d{2}|20[0-2]\d|\d{2})\b/);
  const yearMatch = combined.match(/\b(1[1-9]\d{2}|20[0-2]\d)\b/);
  const centuryMatch = combined.match(/\b(\d{1,2}(?:st|nd|rd|th)[- ]century)\b/i);

  const eraLabel = rangeMatch
    ? `${rangeMatch[1]}–${rangeMatch[2]}`
    : yearMatch
    ? yearMatch[1]
    : centuryMatch
    ? centuryMatch[1]
    : '';

  if (matchedStyle && eraLabel) return `${matchedStyle} · ${eraLabel}`;
  if (matchedStyle) return `${matchedStyle} Architecture`;
  if (eraLabel) return `Historic Landmark · ${eraLabel}`;
  return 'Civic & Architectural Landmark';
}

function extractArchitect(text: string): string {
  const patterns = [
    /(?:designed|built|created|sculpted|remodelled|remodeled|planned)\s+by\s+(?:the\s+)?(?:[a-z]+\s+)?(?:architect|sculptor|engineer)?\s*([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+){1,3}(?:\s+and\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+){1,2})?)/,
    /architect(?:s)?\s+([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+){1,3})/,
    /sculptor\s+([A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-ZÀ-ÖØ-Þ][A-Za-zÀ-ÖØ-öø-ÿ.'-]+){1,3})/
  ];

  for (const pat of patterns) {
    const m = text.match(pat);
    if (m && m[1]) {
      const candidate = m[1]
        .replace(/\s+(?:in|between|from|during|for|as|who|which|with)\b.*$/i, '')
        .trim();
      if (candidate.length >= 5 && candidate.length <= 52) {
        return candidate;
      }
    }
  }
  return 'Historic Civic Commission';
}

/**
 * Split a Wikipedia multi-sentence extract into a punchy 1-sentence spatial hook,
 * a rich multi-sentence overview (plus optional second paragraph), accurate architectural metadata,
 * and 2-3 non-repetitive key takeaway bullets.
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
  historicalContext?: string;
  highlights: string[];
} {
  const cleaned = cleanWikiProse(extract || '');
  const sentences = splitIntoSentences(cleaned);

  const cleanDesc = description
    ? description.charAt(0).toUpperCase() + description.slice(1).replace(/\.$/, '')
    : '';

  const whyItMatters =
    sentences[0] ||
    (cleanDesc
      ? `${title} — ${cleanDesc}.`
      : `${title} is a prominent architectural landmark in this square.`);

  // Primary summary uses sentences 1..4 so it never repeats sentence 0 when multiple sentences exist
  const primarySentences = sentences.slice(1, 5);
  const summary =
    primarySentences.length > 0
      ? primarySentences.join(' ')
      : cleanDesc && sentences[0]
      ? `${cleanDesc}. ${sentences[0]}`
      : whyItMatters;

  // Optional extended paragraph from sentences 5..8 if the article has rich historical depth
  const extendedSentences = sentences.slice(5, 9);
  const historicalContext =
    extendedSentences.length > 0 ? extendedSentences.join(' ') : undefined;

  const styleAndEra = extractStyleAndEra(cleaned, description);
  const architect = extractArchitect(cleaned);

  // Build non-repetitive highlights so bullets never duplicate the summary paragraph verbatim
  const usedInSummary = new Set([whyItMatters, ...primarySentences]);
  const unusedSentences = sentences.filter((s) => !usedInSummary.has(s));

  const highlights: string[] = [];

  if (cleanDesc) {
    highlights.push(`Civic & urban role: ${cleanDesc}.`);
  }

  for (const s of unusedSentences) {
    if (highlights.length >= 3) break;
    highlights.push(s);
  }

  if (highlights.length < 3 && styleAndEra !== 'Civic & Architectural Landmark') {
    highlights.push(`Architectural period & character: ${styleAndEra}.`);
  }

  if (highlights.length < 3 && architect !== 'Historic Civic Commission') {
    highlights.push(`Attributed designer / builder: ${architect}.`);
  }

  if (highlights.length < 2 && primarySentences.length > 1) {
    highlights.push(primarySentences[primarySentences.length - 1]);
  }

  return {
    whyItMatters,
    styleAndEra,
    architect,
    summary,
    historicalContext,
    highlights: highlights.slice(0, 3)
  };
}

/**
 * Fetches the full, untruncated Wikipedia introductory extract when a user selects a live landmark
 * so that live-spotted buildings have comprehensive multi-paragraph summaries and accurate metadata.
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
      whyItMatters: parsed.whyItMatters,
      styleAndEra: parsed.styleAndEra,
      architect: parsed.architect,
      summary: parsed.summary,
      historicalContext: parsed.historicalContext,
      highlights: parsed.highlights,
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
