import { Landmark } from '../types';
import {
  formatStructuredBuiltYear,
  isInstitutionalEntity,
  parseRichWikipediaSummary
} from '../utils/parsers';
import {
  computeLandmarkImportance,
  inferCategory,
  isArchitecturalBuilding
} from '../utils/category';
import { isUsableBuildingPhoto } from '../utils/photo';

/**
 * Queries Wikidata's live SPARQL service for all notable items within `radiusMeters`
 * ranked by global sitelink count (fame), filters out demolished structures (`P576`)
 * and non-building institutions, and enriches the top buildings/statues/fountains
 * with Wikipedia summaries, thumbnails, and structured `P571`/`P1619` build dates.
 */
export async function fetchWikidataRankedLandmarks(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Landmark[]> {
  const radiusKm = Math.max(0.4, Math.min(8.0, radiusMeters / 1000)).toFixed(2);

  const sparql = `
SELECT ?item ?itemLabel ?itemDescription (SAMPLE(?loc) AS ?coord) (MAX(?sl) AS ?sitelinks) (MIN(?inc) AS ?inception) (MIN(?open) AS ?opened) (SAMPLE(?img) AS ?image) WHERE {
  SERVICE wikibase:around {
    ?item wdt:P625 ?loc .
    bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
    bd:serviceParam wikibase:radius "${radiusKm}" .
  }
  ?item wikibase:sitelinks ?sl .
  FILTER(?sl >= 2)
  FILTER NOT EXISTS { ?item wdt:P576 ?demolished }
  OPTIONAL { ?item wdt:P571 ?inc }
  OPTIONAL { ?item wdt:P1619 ?open }
  OPTIONAL { ?item wdt:P18 ?img }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel ?itemDescription
ORDER BY DESC(?sitelinks)
LIMIT 95
`.trim();

  const sparqlUrl = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(
    sparql
  )}`;

  const sparqlRes = await fetch(sparqlUrl, {
    headers: {
      Accept: 'application/sparql-results+json'
    }
  });
  if (!sparqlRes.ok) {
    throw new Error(`Wikidata SPARQL error: ${sparqlRes.status}`);
  }

  const sparqlData = await sparqlRes.json();
  const bindings: any[] = sparqlData?.results?.bindings || [];

  interface WikidataCandidate {
    qid: string;
    label: string;
    description: string;
    lat: number;
    lng: number;
    sitelinks: number;
    structuredBuilt?: string;
    commonsImg?: string;
  }

  const candidates: WikidataCandidate[] = [];

  for (const b of bindings) {
    const itemUri: string = b.item?.value || '';
    const qid = itemUri.split('/').pop() || '';
    const label: string = b.itemLabel?.value || '';
    const description: string = b.itemDescription?.value || '';
    const coordStr: string = b.coord?.value || '';
    const ptMatch = coordStr.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
    if (!qid || !label || !ptMatch) continue;

    const itemLng = parseFloat(ptMatch[1]);
    const itemLat = parseFloat(ptMatch[2]);
    if (Number.isNaN(itemLat) || Number.isNaN(itemLng)) continue;

    // Pre-filter using label + Wikidata description so cities, events, universities, and companies are dropped early
    if (!isArchitecturalBuilding(label, description, '')) continue;

    const sitelinks = parseInt(b.sitelinks?.value || '2', 10);
    const isInst = isInstitutionalEntity(label, description);
    const structuredBuilt = formatStructuredBuiltYear(
      b.inception?.value,
      b.opened?.value,
      isInst
    );

    let commonsImg: string | undefined;
    if (b.image?.value) {
      const rawImg: string = b.image.value;
      // Convert Special:FilePath URLs to 960px thumbnail URLs
      commonsImg = rawImg.includes('Special:FilePath/')
        ? `${rawImg.replace(/^http:/, 'https:')}?width=960`
        : rawImg.replace(/^http:/, 'https:');
    }

    candidates.push({
      qid,
      label,
      description,
      lat: itemLat,
      lng: itemLng,
      sitelinks,
      structuredBuilt,
      commonsImg
    });

    if (candidates.length >= 45) break;
  }

  if (candidates.length === 0) return [];

  // Resolve exact English Wikipedia titles for the candidate QIDs via wbgetentities
  const qidList = candidates.map((c) => c.qid).join('|');
  const qidToWikiTitle = new Map<string, string>();

  try {
    const wbUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(
      qidList
    )}&props=sitelinks&sitefilter=enwiki&format=json&origin=*`;
    const wbRes = await fetch(wbUrl);
    if (wbRes.ok) {
      const wbData = await wbRes.json();
      const entities = wbData?.entities || {};
      for (const [qid, ent] of Object.entries<any>(entities)) {
        const enTitle = ent?.sitelinks?.enwiki?.title;
        if (enTitle) {
          qidToWikiTitle.set(qid, enTitle);
        }
      }
    }
  } catch (_) {}

  // Batch-fetch Wikipedia extracts, descriptions, and thumbnails for resolved titles
  const wikiTitles = Array.from(
    new Set(
      candidates.map((c) => qidToWikiTitle.get(c.qid) || c.label).slice(0, 45)
    )
  );

  const wikiPageByTitle = new Map<string, any>();
  if (wikiTitles.length > 0) {
    try {
      const wpUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        wikiTitles.join('|')
      )}&redirects=1&prop=pageimages|extracts|description|info&exintro=1&explaintext=1&exchars=1400&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
      const wpRes = await fetch(wpUrl);
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        const pages: any[] = wpData?.query?.pages
          ? Object.values(wpData.query.pages)
          : [];
        const redirects: Array<{ from: string; to: string }> =
          wpData?.query?.redirects || [];

        for (const p of pages) {
          if (p.missing !== undefined) continue;
          wikiPageByTitle.set(p.title.toLowerCase(), p);
        }
        for (const r of redirects) {
          const target = wikiPageByTitle.get(r.to.toLowerCase());
          if (target) {
            wikiPageByTitle.set(r.from.toLowerCase(), target);
          }
        }
      }
    } catch (_) {}
  }

  const results: Landmark[] = [];

  for (const c of candidates) {
    const resolvedTitle = qidToWikiTitle.get(c.qid) || c.label;
    const wp =
      wikiPageByTitle.get(resolvedTitle.toLowerCase()) ||
      wikiPageByTitle.get(c.label.toLowerCase());

    const extract: string = wp?.extract || '';
    const desc: string = wp?.description || c.description || '';
    const titleForCheck = wp?.title || c.label;

    if (!isArchitecturalBuilding(titleForCheck, desc, extract)) {
      continue;
    }

    const cleanName = titleForCheck.replace(/\s*\([^)]*\)\s*/g, '').trim();
    const cat = inferCategory(cleanName, `${desc} ${extract}`);
    const parsed = parseRichWikipediaSummary(cleanName, desc, extract);

    const rawThumb = wp?.thumbnail?.source || c.commonsImg;
    const hasValidThumb = Boolean(rawThumb && isUsableBuildingPhoto(rawThumb));
    const usableThumb = hasValidThumb
      ? rawThumb!
      : 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg';

    const importance = computeLandmarkImportance(
      cleanName,
      desc,
      extract,
      wp?.length || 3500,
      hasValidThumb,
      c.sitelinks
    );

    results.push({
      id: wp?.pageid ? `wiki-${wp.pageid}` : `wd-${c.qid}`,
      name: cleanName,
      role: desc
        ? desc.charAt(0).toUpperCase() + desc.slice(1)
        : cat.catLabel,
      category: cat.category,
      catLabel: cat.catLabel,
      lat: c.lat,
      lng: c.lng,
      wikiTitle: encodeURIComponent(
        (wp?.title || resolvedTitle).replace(/\s+/g, '_')
      ),
      built: parsed.built || c.structuredBuilt,
      summary: parsed.summary,
      fallbackImg: usableThumb,
      importance,
      enriched: Boolean(extract)
    });
  }

  return results;
}
