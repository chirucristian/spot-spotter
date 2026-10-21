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
  if (t.includes('fountain')) {
    return { category: 'culture', catLabel: 'Fountain' };
  }
  if (
    t.includes('statue') ||
    t.includes('sculpture') ||
    t.includes('monument') ||
    t.includes('memorial') ||
    t.includes('obelisk')
  ) {
    return { category: 'culture', catLabel: 'Monument' };
  }
  if (
    t.includes('courthouse') ||
    t.includes('guildhall') ||
    t.includes('palace of justice') ||
    t.includes('tribunale')
  ) {
    return { category: 'law', catLabel: 'Courthouse' };
  }
  if (
    t.includes('palace') ||
    t.includes('palazzo') ||
    t.includes('city hall') ||
    t.includes('town hall') ||
    t.includes('stadhuis') ||
    t.includes('hôtel de ville') ||
    t.includes('rathaus')
  ) {
    return {
      category: 'civic',
      catLabel: t.includes('palace') || t.includes('palazzo') ? 'Palace' : 'City Hall'
    };
  }
  if (
    t.includes('cathedral') ||
    t.includes('church') ||
    t.includes('abbey') ||
    t.includes('basilica') ||
    t.includes('chapel') ||
    t.includes('mosque') ||
    t.includes('synagogue') ||
    t.includes('temple')
  ) {
    return { category: 'sacred', catLabel: t.includes('cathedral') ? 'Cathedral' : 'Sacred Building' };
  }
  if (t.includes('skyscraper') || t.includes('tower') || t.includes('high-rise')) {
    return { category: 'civic', catLabel: 'Tower' };
  }
  if (t.includes('castle') || t.includes('fortress') || t.includes('citadel')) {
    return { category: 'civic', catLabel: 'Fortress' };
  }
  if (t.includes('opera house') || t.includes('concert hall') || t.includes('theatre') || t.includes('theater')) {
    return { category: 'culture', catLabel: 'Hall & Theatre' };
  }
  if (t.includes('museum') || t.includes('gallery') || t.includes('library')) {
    return { category: 'culture', catLabel: t.includes('library') ? 'Library Building' : 'Museum Building' };
  }
  return { category: 'civic', catLabel: 'Building' };
}

/**
 * Strictly determines whether a Wikipedia geosearch page represents an actual physical
 * building/edifice (e.g., "The Shard", "Palace of Westminster", "Middlesex Guildhall")
 * OR a famous statue/monument/fountain (e.g., "Havis Amanda", "Statue of Alexander II"),
 * while rejecting tenant companies, corporations, government ministries/agencies,
 * legislatures, courts-as-organizations, universities-as-institutions, streets, and events.
 */
export function isArchitecturalBuilding(
  title: string,
  description = '',
  extract = ''
): boolean {
  const cleanTitle = title.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const titleLower = cleanTitle.toLowerCase();
  const descLower = description.toLowerCase();
  const firstSentence = (extract.split(/(?<=[.!?])\s+/)[0] || '').toLowerCase();
  const leadText = `${descLower} ${firstSentence}`;

  // 1. Check if it is explicitly a physical building, tower, palace, church, statue, monument, or fountain
  const HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE =
    /\b(building|edifice|skyscraper|tower|palace|palazzo|palatul|castle|citadel|fortress|cathedral|church|abbey|basilica|chapel|kirkko|tuomiokirkko|mansion|manor|villa|house|talo|linna|säätytalo|broodhuis|stadhuis|rathaus|hôtel de ville|city hall|town hall|guildhall|courthouse|rotunda|pavilion|loggia|arcade|opera house|concert hall|railway station|central station|train station|statue|fountain|monument|memorial|cenotaph|obelisk|arch|gate)\b/i.test(
      cleanTitle
    ) &&
    !/\b(house of commons|house of lords|house of representatives|publishing house|software house|fashion house|opera company|theatre company|station road|station street|underground station|metro station|tube station|tram stop|bus station)\b/i.test(
      cleanTitle
    );

  // 2. Reject titles that name an institution, ministry, legislature, court organization, company, or school
  //    rather than the building itself
  const INSTITUTION_TITLE_PATTERNS =
    /\b(ministry of|department of|office of|chancellor of|cabinet of|council of|parliament of|senate of|house of commons|house of lords|house of representatives|diet of|supreme court of|court of appeal|constitutional court|high court of|district court|embassy of|consulate of|high commission|diplomatic mission|university of|college of|academy of|institute of|faculty of|school of|bank of|central bank|national bank|stock exchange|chamber of commerce|church of england|church of sweden|diocese of|archdiocese of|parish of|municipality of|city of|borough of|battle of|bombing of|siege of|treaty of|fire of|election|festival|orchestra|choir|fc|f\.c\.|sports club)\b/i;

  if (INSTITUTION_TITLE_PATTERNS.test(cleanTitle) && !HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE) {
    return false;
  }

  // 3. Reject if Wikidata description defines the entity as a company, business, government agency/ministry,
  //    judicial body, educational institution, media outlet, restaurant/retailer, street, district, or person
  const STRICT_INSTITUTION_OR_NON_LANDMARK_DESC =
    /\b(company|corporation|multinational|business|enterprise|law firm|consultancy|holding company|conglomerate|central bank|financial institution|commercial bank|investment bank|insurance|retailer|supermarket|department store chain|restaurant|café|coffeehouse|pub|bar|nightclub|newspaper|magazine|periodical|broadcaster|television|radio station|record label|publisher|software|airline|government agency|government ministry|ministry of|executive department|state agency|regulatory agency|local authority|legislature|upper house|lower house|bicameral|unicameral|parliamentary chamber|supreme court|appellate court|court of law|judicial body|diplomatic mission|embassy|consulate|public university|research university|private university|university in|higher education|business school|law school|medical school|secondary school|primary school|grammar school|research institute|think tank|learned society|scientific society|non-profit|charity|foundation|association|federation|trade union|political party|orchestra|ensemble|choir|opera company|theatre company|ballet company|sports club|football club|public square|town square|city square|square in|plaza in|piazza in|urban park|public park|park in|garden in|street in|thoroughfare|avenue|boulevard|road in|alley|neighbourhood|neighborhood|district|quarter|suburb|borough|municipality|commune|parish|island|peninsula|harbour|harbor|canal|river|cemetery|graveyard|underground station|metro station|subway station|tube station|tram stop|bus station|ferry|ship|vessel|museum ship|event|ceremony|protest|riot|massacre|politician|monarch|writer|painter|composer|disambiguation|medieval term)\b/i;

  if (STRICT_INSTITUTION_OR_NON_LANDMARK_DESC.test(descLower)) {
    return false;
  }

  // 4. Reject if the first sentence of the Wikipedia extract defines it as a company, institution,
  //    organization, agency, school, or outdoor area rather than a physical building/statue/fountain
  const FIRST_SENTENCE_IS_INSTITUTION =
    /\bis\s+(?:a|an|the)\s+(?:[a-z-]+\s+){0,3}(?:company|corporation|firm|business|bank|ministry|government\s+agency|department|legislature|parliament|upper\s+house|lower\s+house|court|supreme\s+court|tribunal|university|college|school|institute|academy|society|association|foundation|organization|organisation|charity|union|party|newspaper|magazine|broadcaster|orchestra|club|square|plaza|piazza|park|garden|street|road|avenue|boulevard|district|neighbourhood|neighborhood|island|metro\s+station|underground\s+station|tube\s+station|ship)\b/i;

  if (FIRST_SENTENCE_IS_INSTITUTION.test(firstSentence) && !HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE) {
    return false;
  }

  // Reject squares, parks, streets, cemeteries by title
  if (/\b(square|piazza|plaza|park|esplanade|gardens|cemetery|churchyard)\b/i.test(titleLower)) {
    return false;
  }

  // 5. Require positive evidence of a physical building, architectural structure, statue/monument, or fountain
  const POSITIVE_PHYSICAL_CUES =
    /\b(building|edifice|skyscraper|high-rise|tower|palace|palazzo|castle|fortress|citadel|cathedral|church|basilica|abbey|chapel|mosque|synagogue|temple|mansion|manor|villa|historic house|townhouse|city hall|town hall|guildhall|courthouse|stadhuis|rathaus|hôtel de ville|broodhuis|säätytalo|parliament house|parliament building|main building|library building|museum building|opera house|concert hall|theatre building|theater building|market hall|rotunda|pavilion|loggia|arcade|terminal building|central station|statue|sculpture|bronze|fountain|monument|memorial|cenotaph|obelisk|triumphal arch|designed by|sculpted by|built in|built between|constructed in|constructed between|completed in|erected in|unveiled in|neoclassical|gothic revival|baroque|renaissance|art nouveau|art deco|brutalist|modernist|facade|façade|storey|story|floors)\b/i;

  return HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE || POSITIVE_PHYSICAL_CUES.test(leadText);
}

/**
 * Computes a 1–100 prominence score for any Wikipedia building, statue, or fountain so that
 * zoomed-out views surface major city icons and zoomed-in views include local landmarks.
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
    /\b(cathedral|palace|skyscraper|shard|gherkin|castle|fortress|citadel|central station|city hall|town hall|basilica|abbey|opera house|guildhall)\b/.test(
      text
    )
  ) {
    score += 24;
  } else if (
    /\b(building|tower|house|hall|mansion|villa|pavilion|rotunda|loggia|church|statue|sculpture|fountain|monument|memorial|library|museum|theatre|theater)\b/.test(
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
 * Extracts the construction/creation year or period ONLY when explicitly stated in the source text
 * with a clear construction, completion, or unveiling verb/phrase. Never guesses from random years.
 */
export function extractBuiltYear(text: string, description = ''): string | undefined {
  const combined = `${description}. ${text}`;

  // 1. "built/constructed/erected/completed/sculpted/cast between YYYY and YYYY" or "from YYYY to YYYY"
  const betweenMatch = combined.match(
    /\b(?:built|constructed|erected|completed|rebuilt|sculpted|cast|created|construction\s+took\s+place|construction\s+lasted)\s+(?:between|from)\s+(1[0-9]\d{2}|20[0-2]\d)\s+(?:and|to)\s+(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  if (betweenMatch) {
    return `${betweenMatch[1]}–${betweenMatch[2]}`;
  }

  // 2. "construction began/started in YYYY and completed/finished/opened in YYYY"
  const beganCompletedMatch = combined.match(
    /\b(?:construction|building\s+work)\s+(?:began|started|commenced)\s+in\s+(?:[A-Z][a-z]+\s+)?(1[0-9]\d{2}|20[0-2]\d)\b[^.]{0,65}?\b(?:completed|finished|ended|opened|inaugurated|consecrated|topped\s+out)\s+in\s+(?:[A-Z][a-z]+\s+)?(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  if (beganCompletedMatch) {
    return `${beganCompletedMatch[1]}–${beganCompletedMatch[2]}`;
  }

  // 3. Explicit construction/completion/unveiling verb + year or year-range:
  //    e.g. "built in 1757", "completed in 1852", "unveiled in 1908", "erected in 1894", "opened in 1887"
  const explicitVerbMatch = combined.match(
    /\b(?:built|constructed|completed|erected|rebuilt|opened|inaugurated|consecrated|unveiled|sculpted|cast)\s+(?:on\s+\d{1,2}\s+[A-Z][a-z]+\s+|in\s+|around\s+|c\.\s*|ca\.\s*)(?:[A-Z][a-z]+\s+(?:\d{1,2},?\s+)?)?(1[0-9]\d{2}|20[0-2]\d)(?:\s*[–—-]\s*(1[0-9]\d{2}|20[0-2]\d|\d{2}))?\b/i
  );
  if (explicitVerbMatch) {
    return explicitVerbMatch[2]
      ? `${explicitVerbMatch[1]}–${explicitVerbMatch[2]}`
      : explicitVerbMatch[1];
  }

  // 4. "built/constructed/completed YYYY–YYYY" (directly followed by a year range)
  const directRangeMatch = combined.match(
    /\b(?:built|constructed|completed|erected)\s+(1[0-9]\d{2}|20[0-2]\d)\s*[–—-]\s*(1[0-9]\d{2}|20[0-2]\d|\d{2})\b/i
  );
  if (directRangeMatch) {
    return `${directRangeMatch[1]}–${directRangeMatch[2]}`;
  }

  return undefined;
}

/**
 * Parses a Wikipedia extract into an optional `built` string (only if clearly stated in source)
 * and a cohesive `summary`.
 */
export function parseRichWikipediaSummary(
  title: string,
  description: string | undefined,
  extract: string | undefined
): {
  built?: string;
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
      : `${title} is a notable architectural landmark in this area.`;

  const built = extractBuiltYear(cleaned, description);

  return {
    built,
    summary
  };
}

/**
 * Fetches the full Wikipedia introductory extract when a user selects a live landmark
 * so that live-spotted buildings, statues, and fountains have complete summaries and accurate dates.
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
      ...(parsed.built ? { built: parsed.built } : {}),
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
  /interior|inside|indoor|hall|sala|salone|room|chamber|chapel|crypt|nave|naos|choir|altar|pulpit|organ|ceiling|vault|fresco|mosaic|stained_glass|window|staircase|stairs|lobby|corridor|cafe|library_-_1|courtroom|detail|relief|cristogramma|virtù|portalini|bunker|cellar/i;

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
