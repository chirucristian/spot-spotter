import { useCallback, useMemo, useRef, useState } from 'react';
import { CIVIC_SQUARES } from '../data/squares';
import { Landmark, MapBoundsBox } from '../types';
import { computeDistanceMeters } from '../utils/distance';
import { filterLandmarksForZoomAndBounds } from '../utils/density';
import { fetchWikidataRankedLandmarks } from '../services/wikidata';
import {
  fetchBuildingPhotoGallery,
  fetchFullWikipediaEnrichment,
  fetchWikipediaGeosearchAround
} from '../services/wikipedia';

const INITIAL_POOL: Landmark[] = Object.values(CIVIC_SQUARES).flatMap((sq) =>
  sq.landmarks.map((l) => ({
    ...l,
    importance: l.importance ?? 82
  }))
);

interface UseLandmarkPoolOptions {
  showToast: (msg: string) => void;
  currentZoom: number;
  viewportBounds: MapBoundsBox | null;
}

export function useLandmarkPool({
  showToast,
  currentZoom,
  viewportBounds
}: UseLandmarkPoolOptions) {
  const [landmarkPool, setLandmarkPool] = useState<Landmark[]>(INITIAL_POOL);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const wikiCacheRef = useRef<Map<string, string[]>>(new Map());

  const visibleLandmarks = useMemo(
    () =>
      filterLandmarksForZoomAndBounds(
        landmarkPool,
        currentZoom,
        viewportBounds,
        selectedId
      ),
    [landmarkPool, currentZoom, viewportBounds, selectedId]
  );

  const mergeDiscoveredLandmarks = useCallback((discovered: Landmark[]) => {
    if (discovered.length === 0) return;
    setLandmarkPool((prev) => {
      const next = [...prev];
      for (const item of discovered) {
        const existingIdx = next.findIndex(
          (existing) =>
            existing.wikiTitle === item.wikiTitle ||
            existing.name.toLowerCase() === item.name.toLowerCase() ||
            computeDistanceMeters(existing.lat, existing.lng, item.lat, item.lng) < 18
        );
        if (existingIdx === -1) {
          next.push(item);
        } else {
          const existing = next[existingIdx];
          next[existingIdx] = {
            ...existing,
            built: item.built || existing.built,
            importance: Math.max(existing.importance ?? 60, item.importance ?? 60),
            summary:
              item.summary.length > existing.summary.length
                ? item.summary
                : existing.summary
          };
        }
      }
      return next;
    });
  }, []);

  const spotBuildingsAround = useCallback(
    async (
      lat: number,
      lng: number,
      radiusMeters = 1200,
      silent = false
    ): Promise<boolean> => {
      const clampedRadius = Math.max(400, Math.min(10000, Math.round(radiusMeters)));

      if (!silent) {
        setIsScanning(true);
        showToast('Spotting landmarks & buildings in view...');
      }

      try {
        const wikidataPromise = fetchWikidataRankedLandmarks(lat, lng, clampedRadius).then(
          (wdItems) => {
            if (wdItems.length > 0) mergeDiscoveredLandmarks(wdItems);
            return wdItems;
          }
        );

        const geosearchPromise = fetchWikipediaGeosearchAround(lat, lng, clampedRadius).then(
          (geoItems) => {
            if (geoItems.length > 0) mergeDiscoveredLandmarks(geoItems);
            return geoItems;
          }
        );

        const [wdResult, geoResult] = await Promise.allSettled([
          wikidataPromise,
          geosearchPromise
        ]);

        const wdCount = wdResult.status === 'fulfilled' ? wdResult.value.length : 0;
        const geoCount = geoResult.status === 'fulfilled' ? geoResult.value.length : 0;
        const totalUnique = wdCount + geoCount;

        // Both sources failed (rate limit / network): that's an error, not an empty area.
        if (wdResult.status === 'rejected' && geoResult.status === 'rejected') {
          console.error('Landmark sources failed', wdResult.reason, geoResult.reason);
          if (!silent) showToast('Could not fetch live landmarks right now.');
          return false;
        }

        if (totalUnique === 0) {
          if (!silent) showToast('No landmarks found in this view.');
          return true;
        }

        if (!silent) {
          showToast('Updated landmarks in this area');
        }
        return true;
      } catch (err) {
        console.error(err);
        if (!silent) {
          showToast('Could not fetch live landmarks right now.');
        }
        return false;
      } finally {
        if (!silent) {
          setIsScanning(false);
        }
      }
    },
    [mergeDiscoveredLandmarks, showToast]
  );

  const selectLandmark = useCallback(
    async (landmarkId: string) => {
      const lm = landmarkPool.find((l) => l.id === landmarkId);
      if (!lm) return;

      setSelectedId(lm.id);

      const cacheKey = lm.wikiTitle || lm.id;
      const needsPhotos = !wikiCacheRef.current.has(cacheKey);
      const needsEnrichment = Boolean(lm.wikiTitle && !lm.enriched);

      if (needsPhotos || needsEnrichment) {
        try {
          const [gallery, enrichedPatch] = await Promise.all([
            needsPhotos
              ? fetchBuildingPhotoGallery(
                  lm.wikiTitle,
                  lm.name,
                  lm.photos,
                  lm.fallbackImg
                )
              : Promise.resolve<string[]>(wikiCacheRef.current.get(cacheKey) || []),
            needsEnrichment
              ? fetchFullWikipediaEnrichment(lm.wikiTitle, lm.name, lm.role)
              : Promise.resolve(null)
          ]);

          if (needsPhotos) {
            wikiCacheRef.current.set(cacheKey, gallery);
          }

          setLandmarkPool((prev) =>
            prev.map((item) => {
              if (item.id !== lm.id) return item;
              return {
                ...item,
                ...(enrichedPatch || {}),
                ...(gallery.length > 0
                  ? {
                      fallbackImg: gallery[0],
                      photos: gallery
                    }
                  : {})
              };
            })
          );
        } catch (_) {}
      }
    },
    [landmarkPool]
  );

  const selectedLandmark = useMemo(
    () => landmarkPool.find((l) => l.id === selectedId) || null,
    [landmarkPool, selectedId]
  );

  return {
    landmarkPool,
    visibleLandmarks,
    selectedId,
    setSelectedId,
    selectedLandmark,
    isScanning,
    spotBuildingsAround,
    selectLandmark,
    mergeDiscoveredLandmarks
  };
}
