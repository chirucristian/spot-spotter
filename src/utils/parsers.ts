/**
 * Strips noisy Wikipedia section headings, pronunciation/IPA blocks and empty parentheses so prose reads cleanly.
 */
export function cleanWikiProse(raw: string): string {
  return raw
    .replace(/==+[^=]+==+/g, '')
    .replace(/\s*\([^)]*(?:IPA|pronounced|\/[^/]+\/|;\s*[A-Za-z]+:)[^)]*\)/gi, '')
    .replace(/\s*\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitIntoSentences(text: string): string[] {
  const protectedText = text
    .replace(
      /\b(St|Dr|Mr|Mrs|Ms|Prof|Jr|Sr|Rev|Gen|Col|Capt|Lt|Sgt|No|ca|cf|approx|est|vol|fig|inc|ltd)\.\s+/gi,
      '$1\u0000 '
    )
    .replace(/\b([A-Z])\.\s+/g, '$1\u0000 ');

  return protectedText
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“‘])/)
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter((s) => s.length > 22);
}

/**
 * Detects whether an entity is primarily an institution, organization, university,
 * library, museum, or government body where Wikidata's inception (P571) indicates
 * when the legal organization was established rather than when the physical building was constructed.
 */
export function isInstitutionalEntity(
  title: string,
  description = '',
  role = ''
): boolean {
  const combined = `${title} ${description} ${role}`.toLowerCase();
  return /\b(national library|library|university|college|academy|institute|school|museum|art gallery|central bank|national bank|bank of|ministry|department of|agency|parliament|legislature|court of|hospital|company|corporation|firm|broadcaster|association|foundation|federation)\b/i.test(
    combined
  );
}

/**
 * Formats structured Wikidata P571 (inception) and P1619 (official opening) ISO timestamps
 * into a clean `Built` string (e.g., "1961–1962" or "1914") when clearly present.
 * For institutional entities, institutional inception (P571) is strictly rejected to prevent
 * displaying an organization's founding year as the construction date of a modern building.
 */
export function formatStructuredBuiltYear(
  inceptionIso?: string,
  openedIso?: string,
  isInstitution = false
): string | undefined {
  const incYear = inceptionIso?.match(/^\+?(\d{4})-/)?.[1];
  const openYear = openedIso?.match(/^\+?(\d{4})-/)?.[1];

  const incNum = incYear ? Number(incYear) : NaN;
  const openNum = openYear ? Number(openYear) : NaN;

  const validInc = !Number.isNaN(incNum) && incNum >= 100 && incNum <= 2030;
  const validOpen = !Number.isNaN(openNum) && openNum >= 100 && openNum <= 2030;

  // If this entity is an institution, inception (P571) represents its historical founding,
  // NOT the physical construction of the building in front of the user!
  if (isInstitution) {
    if (validOpen) return String(openNum);
    return undefined;
  }

  if (validInc && validOpen) {
    if (incNum === openNum) return String(incNum);
    if (incNum < openNum && openNum - incNum <= 120) {
      return `${incNum}–${openNum}`;
    }
    return String(openNum);
  }
  if (validOpen) return String(openNum);
  if (validInc) return String(incNum);
  return undefined;
}

/**
 * Extracts the construction/creation year or period ONLY when explicitly stated in the source text
 * with a clear construction, completion, or unveiling verb/phrase. Never confuses institutional
 * establishment dates or predecessor schools with physical building construction.
 */
export function extractBuiltYear(
  text: string,
  description = '',
  title = ''
): string | undefined {
  const isInst = isInstitutionalEntity(title, description);

  // 1. Explicit start and completion of building construction across sentences:
  //    e.g. "In 1986, a new ... location began to be built ... completed the construction in 2011"
  const startMatch = text.match(
    /\b(?:in\s+(1[0-9]\d{2}|20[0-2]\d),?\s+[^.\n]{0,80}?\b(?:began to be built|construction\s+(?:began|started))|(?:began to be built|construction\s+(?:began|started))\s+[^.\n]{0,80}?in\s+(1[0-9]\d{2}|20[0-2]\d))\b/i
  );
  const startYr = startMatch ? startMatch[1] || startMatch[2] : undefined;

  const endMatch = text.match(
    /\b(?:completed\s+(?:the\s+)?construction|construction\s+(?:was\s+)?completed|building\s+was\s+finished)\s+in\s+(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  const endYr = endMatch ? endMatch[1] : undefined;

  if (startYr && endYr && Number(startYr) <= Number(endYr)) {
    return startYr === endYr ? startYr : `${startYr}–${endYr}`;
  }

  // 2. "built/constructed/erected/completed/sculpted/cast between YYYY and YYYY" or "from YYYY to YYYY"
  const betweenMatch = text.match(
    /\b(?:built|constructed|erected|completed|rebuilt|sculpted|cast|created|construction\s+took\s+place|construction\s+lasted)\s+(?:between|from)\s+(1[0-9]\d{2}|20[0-2]\d)\s+(?:and|to)\s+(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  if (betweenMatch) {
    return `${betweenMatch[1]}–${betweenMatch[2]}`;
  }

  // 3. "construction began/started in YYYY and completed/finished/opened in YYYY"
  const beganCompletedMatch = text.match(
    /\b(?:construction|building\s+work)\s+(?:began|started|commenced)\s+in\s+(?:[A-Z][a-z]+\s+)?(1[0-9]\d{2}|20[0-2]\d)\b[^.]{0,65}?\b(?:completed|finished|ended|opened|inaugurated|consecrated|topped\s+out)\s+in\s+(?:[A-Z][a-z]+\s+)?(1[0-9]\d{2}|20[0-2]\d)\b/i
  );
  if (beganCompletedMatch) {
    return `${beganCompletedMatch[1]}–${beganCompletedMatch[2]}`;
  }

  // 4. "building was completed in YYYY" or "completed the construction in YYYY"
  if (endYr) {
    return endYr;
  }

  // 5. Explicit construction verb + year or year-range:
  //    e.g. "built in 1757", "completed in 1852", "erected in 1894", "unveiled in 1908"
  //    NOTE: For institutions, require explicit building nouns (e.g. "building was built in 1986", "new building opened in 2012")
  //    and DO NOT match bare "opened in YYYY" or "established in YYYY" which refers to the institution!
  const constructionVerbs = isInst
    ? '(?:building|structure|headquarters|location|palace|tower|hall|edifice)\\s+(?:was\\s+)?(?:built|constructed|completed|erected|opened|inaugurated)'
    : '(?:built|constructed|completed|erected|rebuilt|consecrated|unveiled|sculpted|cast|commissioned and built)';

  const explicitVerbRegex = new RegExp(
    `\\b${constructionVerbs}\\s+(?:for\\s+the\\s+\\d{4}\\s+[^,]+?\\s+in\\s+|on\\s+\\d{1,2}\\s+[A-Z][a-z]+\\s+|on\\s+[A-Z][a-z]+\\s+\\d{1,2},\\s+|in\\s+|around\\s+|c\\.\\s*|ca\\.\\s*)(?:[A-Z][a-z]+\\s+(?:\\d{1,2},?\\s+)?)?(1[0-9]\\d{2}|20[0-2]\\d)(?:\\s*[–—-]\\s*(1[0-9]\\d{2}|20[0-2]\\d|\\d{2}))?\\b`,
    'i'
  );
  const explicitVerbMatch = text.match(explicitVerbRegex);
  if (explicitVerbMatch) {
    return explicitVerbMatch[2]
      ? `${explicitVerbMatch[1]}–${explicitVerbMatch[2]}`
      : explicitVerbMatch[1];
  }

  // 6. Non-institution "built/completed YYYY–YYYY"
  if (!isInst) {
    const directRangeMatch = text.match(
      /\b(?:built|constructed|completed|erected)\s+(1[0-9]\d{2}|20[0-2]\d)\s*[–—-]\s*(1[0-9]\d{2}|20[0-2]\d|\d{2})\b/i
    );
    if (directRangeMatch) {
      return `${directRangeMatch[1]}–${directRangeMatch[2]}`;
    }

    // Bare "opened in YYYY" for non-institutional physical buildings (e.g. observation towers, bridges, arenas)
    const openedMatch = text.match(
      /\b(?:opened|inaugurated)\s+(?:to\s+the\s+public\s+)?(?:on\s+\d{1,2}\s+[A-Z][a-z]+\s+|on\s+[A-Z][a-z]+\s+\d{1,2},\s+|in\s+)(?:[A-Z][a-z]+\s+(?:\d{1,2},?\s+)?)?(1[0-9]\d{2}|20[0-2]\d)\b/i
    );
    if (openedMatch) {
      return openedMatch[1];
    }
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
  const rawText = extract || '';
  const leadSection = rawText.split(/==+[^=]+==+/)[0].trim();
  const cleanedLead = cleanWikiProse(leadSection);
  const sentences = splitIntoSentences(cleanedLead);

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

  const built = extractBuiltYear(rawText, description, title);

  return {
    built,
    summary
  };
}
