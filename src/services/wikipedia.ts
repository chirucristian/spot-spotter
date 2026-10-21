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
import {
  isUsableBuildingPhoto,
  normalizePhotoKey,
  scoreExteriorPhoto
} from '../utils/photo';

/**
 * Searches Wikipedia articles with coordinates around a center point, filters for physical buildings,
 * and extracts lead summary & photo.
 */
export async function fetchWikipediaGeosearchAround(
  lat: number,
  lng: number,
  clampedRadius: number
): Promise<Landmark[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=${clampedRadius}&ggslimit=50&prop=coordinates|pageimages|extracts|description|info&exintro=1&explaintext=1&exchars=1400&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages: any[] = data?.query?.pages ? Object.values(data.query.pages) : [];

  const filtered = pages.filter((p) => {
    if (!p.coordinates?.length) return false;
    return isArchitecturalBuilding(p.title, p.description || '', p.extract || '');
  });

  const discovered: Landmark[] = [];
  for (const p of filtered) {
    const c = p.coordinates[0];
    const cat = inferCategory(p.title, p.description || p.extract || '');
    const cleanName = p.title.replace(/\s*\([^)]*\)\s*/g, '');
    const parsed = parseRichWikipediaSummary(cleanName, p.description, p.extract);
    const rawThumb = p.thumbnail?.source;
    const hasValidThumb = Boolean(rawThumb && isUsableBuildingPhoto(rawThumb));
    const usableThumb = hasValidThumb
      ? rawThumb
      : 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg';

    const importance = computeLandmarkImportance(
      cleanName,
      p.description || '',
      p.extract || '',
      p.length || 2500,
      hasValidThumb
    );

    discovered.push({
      id: `wiki-${p.pageid}`,
      name: cleanName,
      role: p.description
        ? p.description.charAt(0).toUpperCase() + p.description.slice(1)
        : cat.catLabel,
      category: cat.category,
      catLabel: cat.catLabel,
      lat: c.lat,
      lng: c.lon,
      wikiTitle: encodeURIComponent(p.title.replace(/\s+/g, '_')),
      built: parsed.built,
      summary: parsed.summary,
      fallbackImg: usableThumb,
      importance
    });
  }
  return discovered;
}

/**
 * Fetches the full Wikipedia introductory extract and Wikidata structured build date (P571/P1619)
 * when a user selects a landmark.
 */
export async function fetchFullWikipediaEnrichment(
  wikiTitle: string,
  buildingName: string,
  existingDescription?: string
): Promise<Partial<Landmark> | null> {
  if (!wikiTitle) return null;
  try {
    const decodedTitle = decodeURIComponent(wikiTitle);
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|description|pageprops&explaintext=1&titles=${encodeURIComponent(
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

    const isInst = isInstitutionalEntity(
      buildingName,
      page.description || existingDescription
    );

    let structuredBuilt: string | undefined;
    const qid: string | undefined = page.pageprops?.wikibase_item;
    if (qid) {
      try {
        const wdUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${encodeURIComponent(
          qid
        )}&props=claims&format=json&origin=*`;
        const wdRes = await fetch(wdUrl);
        if (wdRes.ok) {
          const wdData = await wdRes.json();
          const claims = wdData?.entities?.[qid]?.claims;
          const incIso = claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time;
          const openIso = claims?.P1619?.[0]?.mainsnak?.datavalue?.value?.time;
          structuredBuilt = formatStructuredBuiltYear(incIso, openIso, isInst);
        }
      } catch (_) {}
    }

    const finalBuilt = parsed.built || structuredBuilt;

    return {
      ...(finalBuilt ? { built: finalBuilt } : {}),
      summary: parsed.summary,
      enriched: true
    };
  } catch {
    return null;
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
          const thumbUrl = (
            p.imageinfo?.[0]?.thumburl ||
            p.imageinfo?.[0]?.url ||
            ''
          ).split('?')[0];
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
