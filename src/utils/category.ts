import { LandmarkCategory } from '../types';

export function inferCategory(
  title: string,
  desc = ''
): { category: LandmarkCategory; catLabel: string } {
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
  if (t.includes('skyscraper') || t.includes('tower') || t.includes('high-rise') || t.includes('needle')) {
    return { category: 'civic', catLabel: 'Tower' };
  }
  if (t.includes('stadium') || t.includes('arena') || t.includes('coliseum')) {
    return { category: 'civic', catLabel: 'Arena & Stadium' };
  }
  if (t.includes('castle') || t.includes('fortress') || t.includes('citadel')) {
    return { category: 'civic', catLabel: 'Fortress' };
  }
  if (t.includes('opera house') || t.includes('concert hall') || t.includes('theatre') || t.includes('theater')) {
    return { category: 'culture', catLabel: 'Hall & Theatre' };
  }
  if (t.includes('museum') || t.includes('gallery') || t.includes('library') || t.includes('aquarium')) {
    return { category: 'culture', catLabel: t.includes('library') ? 'Library Building' : 'Museum Building' };
  }
  return { category: 'civic', catLabel: 'Building' };
}

/**
 * Strictly determines whether a candidate represents an actual physical
 * building/edifice (e.g., "The Shard", "Space Needle", "Palace of Westminster", "Middlesex Guildhall")
 * OR a famous statue/monument/fountain (e.g., "Havis Amanda", "Statue of Alexander II"),
 * while rejecting tenant companies, corporations, government ministries/agencies,
 * legislatures, courts-as-organizations, universities-as-institutions, cities, bays, streets, and events.
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

  // Reject wikidata QID placeholders if label is missing
  if (/^Q\d+$/.test(cleanTitle)) return false;

  // 1. Check if it is explicitly a physical building, tower, palace, church, stadium, statue, monument, or fountain
  const HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE =
    /\b(building|edifice|skyscraper|tower|needle|palace|palazzo|palatul|castle|citadel|fortress|cathedral|church|abbey|basilica|chapel|kirkko|tuomiokirkko|mansion|manor|villa|house|talo|linna|säätytalo|broodhuis|stadhuis|rathaus|hôtel de ville|city hall|town hall|guildhall|courthouse|rotunda|pavilion|loggia|arcade|opera house|concert hall|railway station|central station|train station|king street station|union station|stadium|arena|coliseum|conservatory|spheres|library|statue|fountain|monument|memorial|cenotaph|obelisk|arch|gate)\b/i.test(
      cleanTitle
    ) &&
    !/\b(house of commons|house of lords|house of representatives|publishing house|software house|fashion house|customs house officer|opera company|theatre company|station road|station street|underground station|metro station|tube station|light rail station|tram stop|bus station)\b/i.test(
      cleanTitle
    );

  // 2. Reject titles that name an institution, ministry, legislature, court organization, company, or school
  //    rather than the building itself
  const INSTITUTION_TITLE_PATTERNS =
    /\b(ministry of|department of|office of|chancellor of|cabinet of|council of|parliament of|senate of|house of commons|house of lords|house of representatives|diet of|supreme court of|court of appeal|constitutional court|high court of|district court|embassy of|consulate of|high commission|diplomatic mission|university of|college of|academy of|institute of|faculty of|school of|bank of|central bank|national bank|stock exchange|chamber of commerce|church of england|church of sweden|diocese of|archdiocese of|parish of|municipality of|city of|borough of|county of|state of|battle of|bombing of|siege of|treaty of|fire of|election|festival|exposition|world's fair|gold cup|world cup|championship|orchestra|choir|fc|f\.c\.|sports club|autonomous zone)\b/i;

  if (INSTITUTION_TITLE_PATTERNS.test(cleanTitle) && !HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE) {
    return false;
  }

  // 3. Reject if Wikidata description defines the entity as a city, bay, neighborhood, event, company,
  //    business, government agency/ministry, judicial body, university/school, media outlet, restaurant/retailer, street, or person
  const STRICT_INSTITUTION_OR_NON_LANDMARK_DESC =
    /\b(city in|county seat|town in|village in|municipality|metropolitan area|central business district|neighborhood|neighbourhood|district|quarter|suburb|borough|commune|parish|island|peninsula|harbour|harbor|bay of|sound|strait|canal|river|lake|hill in|mountain|company|corporation|multinational|business|enterprise|law firm|consultancy|holding company|conglomerate|central bank|financial institution|commercial bank|investment bank|insurance|retailer|supermarket|grocery|department store chain|chain of|restaurant|café|coffeehouse|deli|bakery|oyster bar|sushi|pizzeria|pub|bar|nightclub|newspaper|magazine|periodical|broadcaster|television|radio station|record label|publisher|software|airline|seaplane base|airport|heliport|government agency|government ministry|ministry of|executive department|state agency|regulatory agency|local authority|legislature|upper house|lower house|bicameral|unicameral|parliamentary chamber|supreme court|appellate court|court of law|judicial body|diplomatic mission|embassy|consulate|archdiocese|diocese|public university|research university|private university|jesuit university|university in|higher education|business school|law school|medical school|secondary school|high school|primary school|grammar school|film school|research institute|think tank|learned society|scientific society|non-profit|charity|foundation|association|federation|trade union|political party|orchestra|ensemble|choir|opera company|theatre company|ballet company|sports club|football club|baseball team|football team|competition|tournament|edition of|world's fair|exposition|convention|public square|town square|city square|square in|plaza in|piazza in|urban park|public park|park in|freeway park|garden in|street in|thoroughfare|avenue|boulevard|road in|alley|cemetery|graveyard|underground station|metro station|subway station|tube station|light rail|tram stop|bus station|ferry|ship|vessel|museum ship|event|ceremony|protest|riot|massacre|politician|monarch|writer|painter|composer|disambiguation|medieval term)\b/i;

  if (STRICT_INSTITUTION_OR_NON_LANDMARK_DESC.test(descLower)) {
    return false;
  }

  // 4. Reject if the first sentence of the Wikipedia extract defines it as a company, institution,
  //    organization, agency, school, city, or outdoor area rather than a physical building/statue/fountain
  const FIRST_SENTENCE_IS_INSTITUTION =
    /\bis\s+(?:a|an|the)\s+(?:[a-z-]+\s+){0,3}(?:city|town|municipality|neighborhood|neighbourhood|district|bay|island|company|corporation|firm|business|chain|restaurant|deli|café|coffeehouse|bank|ministry|government\s+agency|department|legislature|parliament|upper\s+house|lower\s+house|court|supreme\s+court|tribunal|university|college|school|institute|think\s+tank|academy|society|association|foundation|organization|organisation|charity|union|party|newspaper|magazine|broadcaster|radio\s+station|orchestra|club|tournament|competition|exposition|world's\s+fair|square|plaza|piazza|park|garden|street|road|avenue|boulevard|metro\s+station|underground\s+station|tube\s+station|light\s+rail\s+station|ship)\b/i;

  if (FIRST_SENTENCE_IS_INSTITUTION.test(firstSentence) && !HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE) {
    return false;
  }

  // Reject squares, parks, streets, cemeteries by title unless title or description explicitly identifies a building or skyscraper
  if (
    /\b(square|piazza|plaza|park|esplanade|gardens|cemetery|churchyard)\b/i.test(titleLower) &&
    !/\b(tower|building|palace|hall|house|arena|stadium|skyscraper|center|centre|hotel)\b/i.test(titleLower) &&
    !/\b(skyscraper|tower|building|high-rise|edifice|hotel)\b/i.test(descLower)
  ) {
    return false;
  }

  // 5. Require positive evidence of a physical building, architectural structure, stadium/arena, statue/monument, or fountain
  const POSITIVE_PHYSICAL_CUES =
    /\b(building|edifice|skyscraper|high-rise|tower|observation tower|needle|palace|palazzo|castle|fortress|citadel|cathedral|church|basilica|abbey|chapel|mosque|synagogue|temple|mansion|manor|villa|historic house|townhouse|city hall|town hall|guildhall|courthouse|stadhuis|rathaus|hôtel de ville|broodhuis|säätytalo|parliament house|parliament building|main building|library|museum|aquarium|opera house|concert hall|theatre|theater|public market|market hall|rotunda|pavilion|loggia|arcade|terminal|central station|train station|railway station|stadium|arena|coliseum|conservatory|spheres|ferris wheel|hotel|statue|sculpture|bronze|fountain|monument|memorial|cenotaph|obelisk|triumphal arch|designed by|sculpted by|built in|built between|constructed in|constructed between|completed in|erected in|unveiled in|neoclassical|gothic revival|baroque|renaissance|art nouveau|art deco|brutalist|modernist|facade|façade|storey|story|floors)\b/i;

  return HAS_EXPLICIT_PHYSICAL_NOUN_IN_TITLE || POSITIVE_PHYSICAL_CUES.test(leadText);
}

/**
 * Computes a 1–100 prominence score for any building, statue, or fountain.
 * When Wikidata `sitelinks` (number of Wikipedia language editions) is available,
 * uses it as an authoritative global fame metric so major icons like the Space Needle (45 sitelinks)
 * always surface at the top of the map at every zoom level.
 */
export function computeLandmarkImportance(
  title: string,
  description = '',
  extract = '',
  articleLength = 2500,
  hasThumbnail = false,
  sitelinks?: number
): number {
  const text = `${title} ${description} ${extract.slice(0, 220)}`.toLowerCase();

  let score: number;
  if (typeof sitelinks === 'number' && sitelinks > 0) {
    // Map sitelinks (e.g. 2..60+) to a high-confidence base score (45..96)
    score = Math.min(96, Math.round(38 + Math.log2(sitelinks + 1) * 10.5));
  } else {
    score = Math.min(58, Math.max(12, Math.round(Math.sqrt(articleLength) / 2.6)));
    if (hasThumbnail) {
      score += 14;
    }
  }

  if (
    /\b(cathedral|palace|skyscraper|space needle|shard|gherkin|castle|fortress|citadel|central station|city hall|town hall|basilica|abbey|opera house|guildhall|stadium|arena)\b/.test(
      text
    )
  ) {
    score += typeof sitelinks === 'number' ? 6 : 24;
  } else if (
    /\b(building|tower|house|hall|mansion|villa|pavilion|rotunda|loggia|church|statue|sculpture|fountain|monument|memorial|library|museum|theatre|theater)\b/.test(
      text
    )
  ) {
    score += typeof sitelinks === 'number' ? 3 : 14;
  }

  return Math.max(15, Math.min(99, score));
}
