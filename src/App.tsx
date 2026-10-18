import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { CIVIC_SQUARES, DEFAULT_GMAPS_KEY } from './data/squares';
import { Landmark } from './types';
import {
  MapBoundsBox,
  computeDistanceMeters,
  computeLandmarkImportance,
  fetchBuildingPhotoGallery,
  filterLandmarksForZoomAndBounds,
  inferCategory,
  isUsableBuildingPhoto,
  parseRichWikipediaSummary
} from './utils/geo';
import { BuildingCard } from './components/BuildingCard';

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

function createRooftopPillHTML(landmark: Landmark, isSelected: boolean): string {
  const catClass = `cat-${landmark.category || 'civic'}`;
  return `
    <div class="rooftop-pill-anchor ${catClass} ${isSelected ? 'is-selected' : ''}" data-landmark-id="${landmark.id}">
      <div class="rooftop-pill">
        <span class="pill-name">${landmark.name}</span>
      </div>
      <div class="pill-pointer"></div>
      <div class="pill-roof-dot"></div>
    </div>
  `;
}

let collisionRafId: number | null = null;

export function schedulePillCollisionResolution(): void {
  if (collisionRafId !== null) return;
  collisionRafId = requestAnimationFrame(() => {
    collisionRafId = null;
    resolvePillCollisions();
  });
}

/**
 * Pure mathematical collision resolver that uses the untransformed anchor point
 * and static offsetWidth/offsetHeight so CSS transitions never cause a feedback
 * loop or label trembling during zoom.
 */
export function resolvePillCollisions(): void {
  const pills = Array.from(
    document.querySelectorAll<HTMLElement>('.rooftop-pill-anchor:not(.is-exiting)')
  );

  interface PillItem {
    el: HTMLElement;
    anchorX: number;
    anchorY: number;
    width: number;
    height: number;
    isSelected: boolean;
  }

  const items: PillItem[] = [];
  for (const el of pills) {
    const pillBox = el.querySelector<HTMLElement>('.rooftop-pill');
    const parent = el.parentElement;
    if (!pillBox || !parent) continue;

    const width = pillBox.offsetWidth;
    const height = pillBox.offsetHeight;
    if (width === 0 || height === 0) continue;

    // Read the parent marker wrapper's screen position, which is independent of the pill's CSS transition
    const parentRect = parent.getBoundingClientRect();
    items.push({
      el,
      anchorX: parentRect.left,
      anchorY: parentRect.top,
      width,
      height,
      isSelected: el.classList.contains('is-selected')
    });
  }

  // Sort selected first, then bottom-to-top so southern labels stay anchored to their roof
  items.sort((a, b) => {
    if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
    return b.anchorY - a.anchorY;
  });

  interface Box {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  const placedBoxes: Box[] = [];

  for (const item of items) {
    let shiftY = 0;
    let attempts = 0;

    const getBox = (sy: number): Box => ({
      left: item.anchorX - item.width / 2,
      right: item.anchorX + item.width / 2,
      top: item.anchorY - item.height - 12 + sy,
      bottom: item.anchorY - 12 + sy
    });

    let candidate = getBox(shiftY);

    while (
      attempts < 3 &&
      placedBoxes.some(
        (b) =>
          candidate.left < b.right - 3 &&
          candidate.right > b.left + 3 &&
          candidate.top < b.bottom + 3 &&
          candidate.bottom > b.top - 3
      )
    ) {
      shiftY -= 30;
      candidate = getBox(shiftY);
      attempts++;
    }

    placedBoxes.push(candidate);

    const prevShift = item.el.dataset.shiftY;
    const nextShift = String(shiftY);
    if (prevShift !== nextShift) {
      item.el.dataset.shiftY = nextShift;
      item.el.style.setProperty('--pill-shift-y', `${shiftY}px`);
    }
  }
}

function getMobileAwareZoom(baseZoom: number): number {
  return window.innerWidth < 520 ? Math.max(15.8, baseZoom - 0.6) : baseZoom;
}

const INITIAL_POOL: Landmark[] = Object.values(CIVIC_SQUARES).flatMap((sq) =>
  sq.landmarks.map((l) => ({
    ...l,
    importance: l.importance ?? 82
  }))
);

export const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(
    CIVIC_SQUARES['senate-helsinki'].center
  );
  const [landmarkPool, setLandmarkPool] = useState<Landmark[]>(INITIAL_POOL);
  const [currentZoom, setCurrentZoom] = useState<number>(
    getMobileAwareZoom(CIVIC_SQUARES['senate-helsinki'].zoom)
  );
  const [viewportBounds, setViewportBounds] = useState<MapBoundsBox | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [engine, setEngine] = useState<'google' | 'leaflet'>('google');
  const [mapLoaded, setMapLoaded] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const googleContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);

  const googleMapRef = useRef<any>(null);
  const googleOverlaysMapRef = useRef<Map<string, any>>(new Map());
  const googleExitTimersRef = useRef<Map<string, number>>(new Map());
  const googleUserOverlayRef = useRef<any>(null);

  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const leafletExitTimersRef = useRef<Map<string, number>>(new Map());
  const leafletUserMarkerRef = useRef<L.Marker | null>(null);

  const wikiCacheRef = useRef<Map<string, any>>(new Map());
  const queriedRegionsRef = useRef<Array<{ lat: number; lng: number; radius: number }>>([]);
  const autoScanTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  // Compute visible landmarks dynamically based on current zoom level and viewport bounds
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

  const mergeDiscoveredLandmarks = (discovered: Landmark[]) => {
    if (discovered.length === 0) return;
    setLandmarkPool((prev) => {
      const next = [...prev];
      for (const item of discovered) {
        const alreadyExists = next.some(
          (existing) =>
            existing.wikiTitle === item.wikiTitle ||
            existing.name.toLowerCase() === item.name.toLowerCase() ||
            computeDistanceMeters(existing.lat, existing.lng, item.lat, item.lng) < 18
        );
        if (!alreadyExists) {
          next.push(item);
        }
      }
      return next;
    });
  };

  const spotBuildingsAround = async (
    lat: number,
    lng: number,
    radiusMeters = 850,
    silent = false
  ) => {
    const clampedRadius = Math.max(300, Math.min(10000, Math.round(radiusMeters)));

    if (!silent) {
      showToast('Spotting landmarks & buildings in view...');
    }

    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=${clampedRadius}&ggslimit=50&prop=coordinates|pageimages|extracts|description|info&exintro=1&explaintext=1&exchars=750&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      const pages: any[] = data?.query?.pages ? Object.values(data.query.pages) : [];

      const filtered = pages.filter((p) => {
        if (!p.coordinates?.length) return false;
        const text = `${p.title} ${p.description || ''}`.toLowerCase();
        if (
          text.includes('medieval term') ||
          text.includes('disambiguation') ||
          text.includes('election') ||
          text.includes('bombing of') ||
          text.includes('battle of')
        ) {
          return false;
        }
        return true;
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
            : 'Notable Building & Landmark',
          category: cat.category,
          catLabel: cat.catLabel,
          lat: c.lat,
          lng: c.lon,
          wikiTitle: encodeURIComponent(p.title.replace(/\s+/g, '_')),
          whyItMatters: parsed.whyItMatters,
          styleAndEra: parsed.styleAndEra,
          architect: parsed.architect,
          summary: parsed.summary,
          highlights: parsed.highlights,
          fallbackImg: usableThumb,
          importance
        });
      }

      if (discovered.length === 0) {
        if (!silent) showToast('No landmarks found in this view.');
        return;
      }

      mergeDiscoveredLandmarks(discovered);
      if (!silent) {
        showToast('Updated landmarks for current view');
      }
    } catch (err) {
      console.error(err);
      if (!silent) {
        showToast('Could not fetch live landmarks right now.');
      }
    }
  };

  const syncViewportState = (
    center: { lat: number; lng: number },
    zoom: number,
    bounds: MapBoundsBox
  ) => {
    setCurrentZoom(zoom);
    setViewportBounds(bounds);

    if (autoScanTimerRef.current) window.clearTimeout(autoScanTimerRef.current);
    autoScanTimerRef.current = window.setTimeout(() => {
      const diagMeters = computeDistanceMeters(
        bounds.south,
        bounds.west,
        bounds.north,
        bounds.east
      );
      const radius = Math.max(400, Math.min(8000, Math.round(diagMeters / 2)));

      const alreadyQueried = queriedRegionsRef.current.some(
        (q) =>
          computeDistanceMeters(center.lat, center.lng, q.lat, q.lng) < q.radius * 0.35 &&
          Math.abs(q.radius - radius) < q.radius * 0.45
      );

      if (!alreadyQueried) {
        queriedRegionsRef.current.push({ lat: center.lat, lng: center.lng, radius });
        spotBuildingsAround(center.lat, center.lng, radius, true);
      }
    }, 320);
  };

  // Load Google Maps SDK by default, fallback to Leaflet if demo key is throttled
  useEffect(() => {
    let cancelled = false;
    const initialSquare = CIVIC_SQUARES['senate-helsinki'];

    const initLeafletFallback = () => {
      if (cancelled || !leafletContainerRef.current) return;
      setEngine('leaflet');
      if (!leafletMapRef.current) {
        const map = L.map(leafletContainerRef.current, {
          center: [initialSquare.center.lat, initialSquare.center.lng],
          zoom: getMobileAwareZoom(initialSquare.zoom),
          zoomControl: false,
          zoomAnimation: true,
          markerZoomAnimation: true
        });

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 20,
            attribution: '&copy; OpenStreetMap &copy; CARTO'
          }
        ).addTo(map);

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
          {
            maxZoom: 20,
            opacity: 0.55
          }
        ).addTo(map);

        const updateFromLeaflet = () => {
          const b = map.getBounds();
          const c = map.getCenter();
          syncViewportState(
            { lat: c.lat, lng: c.lng },
            map.getZoom(),
            {
              north: b.getNorth(),
              south: b.getSouth(),
              east: b.getEast(),
              west: b.getWest()
            }
          );
          schedulePillCollisionResolution();
        };

        map.on('moveend zoomend', updateFromLeaflet);
        leafletMapRef.current = map;
        window.setTimeout(updateFromLeaflet, 60);
      }
      setMapLoaded((n) => n + 1);
    };

    const loadGoogleSDK = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google?.maps) {
          resolve();
          return;
        }
        window.gm_authFailure = () => {
          reject(new Error('Google Maps demo key quota reached'));
        };
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
          DEFAULT_GMAPS_KEY
        )}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });

    loadGoogleSDK()
      .then(() => {
        if (cancelled || !googleContainerRef.current || !window.google?.maps) return;
        setEngine('google');
        const map = new window.google.maps.Map(googleContainerRef.current, {
          center: initialSquare.center,
          zoom: getMobileAwareZoom(initialSquare.zoom),
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
          styles: [
            { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
          ]
        });

        map.addListener('idle', () => {
          const b = map.getBounds();
          const c = map.getCenter();
          const z = map.getZoom();
          if (b && c && typeof z === 'number') {
            const ne = b.getNorthEast();
            const sw = b.getSouthWest();
            syncViewportState(
              { lat: c.lat(), lng: c.lng() },
              z,
              {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng()
              }
            );
          }
          schedulePillCollisionResolution();
        });

        googleMapRef.current = map;
        setMapLoaded((n) => n + 1);
      })
      .catch(() => {
        initLeafletFallback();
      });

    let observer: MutationObserver | null = null;
    if (googleContainerRef.current) {
      observer = new MutationObserver(() => {
        const errEl = googleContainerRef.current?.querySelector('.gm-err-container, .dismissButton');
        if (errEl) {
          observer?.disconnect();
          initLeafletFallback();
        }
      });
      observer.observe(googleContainerRef.current, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  // Reconcile rooftop pills without destroying existing markers so zoom transitions stay smooth
  useEffect(() => {
    const visibleIds = new Set(visibleLandmarks.map((l) => l.id));

    if (engine === 'google' && googleMapRef.current && window.google?.maps) {
      const map = googleMapRef.current;

      class RooftopOverlay extends window.google.maps.OverlayView {
        pos: any;
        html: string;
        onClick: (() => void) | null;
        div: HTMLDivElement | null = null;

        constructor(pos: { lat: number; lng: number }, html: string, onClick: (() => void) | null) {
          super();
          this.pos = new window.google.maps.LatLng(pos.lat, pos.lng);
          this.html = html;
          this.onClick = onClick;
        }
        onAdd() {
          this.div = document.createElement('div');
          this.div.style.position = 'absolute';
          this.div.style.left = '0px';
          this.div.style.top = '0px';
          this.div.style.willChange = 'transform';
          this.div.innerHTML = this.html;
          const anchor = this.div.querySelector<HTMLElement>('.rooftop-pill-anchor');
          if (anchor) {
            anchor.classList.add('is-entering');
            requestAnimationFrame(() => {
              anchor.classList.remove('is-entering');
            });
          }
          if (this.onClick) {
            this.div.addEventListener('click', (e) => {
              e.stopPropagation();
              this.onClick!();
            });
          }
          (this as any).getPanes().overlayMouseTarget.appendChild(this.div);
        }
        draw() {
          const proj = (this as any).getProjection();
          if (!proj || !this.div) return;
          const pt = proj.fromLatLngToDivPixel(this.pos);
          if (pt) {
            this.div.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0)`;
          }
          schedulePillCollisionResolution();
        }
        onRemove() {
          if (this.div?.parentNode) this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      if (!googleUserOverlayRef.current) {
        const userOv = new RooftopOverlay(
          userLocation,
          `<div class="user-gps-dot"><div class="user-gps-halo"></div><div class="user-gps-inner"></div></div>`,
          null
        );
        (userOv as any).setMap(map);
        googleUserOverlayRef.current = userOv;
      } else {
        googleUserOverlayRef.current.pos = new window.google.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        );
        googleUserOverlayRef.current.draw();
      }

      // Fade out and remove overlays that are no longer visible
      googleOverlaysMapRef.current.forEach((ov, id) => {
        if (!visibleIds.has(id)) {
          if (!googleExitTimersRef.current.has(id)) {
            const anchor = ov.div?.querySelector?.('.rooftop-pill-anchor');
            if (anchor) anchor.classList.add('is-exiting');
            const timer = window.setTimeout(() => {
              ov.setMap(null);
              googleOverlaysMapRef.current.delete(id);
              googleExitTimersRef.current.delete(id);
            }, 220);
            googleExitTimersRef.current.set(id, timer);
          }
        }
      });

      // Add new overlays or update selection state on existing ones
      visibleLandmarks.forEach((lm) => {
        const existingTimer = googleExitTimersRef.current.get(lm.id);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
          googleExitTimersRef.current.delete(lm.id);
        }

        const existingOv = googleOverlaysMapRef.current.get(lm.id);
        if (existingOv) {
          const anchor = existingOv.div?.querySelector?.('.rooftop-pill-anchor');
          if (anchor) {
            anchor.classList.remove('is-exiting');
            anchor.classList.toggle('is-selected', selectedId === lm.id);
          }
          existingOv.onClick = () => handleSelectLandmark(lm.id);
        } else {
          const ov = new RooftopOverlay(
            { lat: lm.lat, lng: lm.lng },
            createRooftopPillHTML(lm, selectedId === lm.id),
            () => handleSelectLandmark(lm.id)
          );
          (ov as any).setMap(map);
          googleOverlaysMapRef.current.set(lm.id, ov);
        }
      });

      schedulePillCollisionResolution();
      return;
    }

    if (engine === 'leaflet' && leafletMapRef.current) {
      const map = leafletMapRef.current;

      if (!leafletUserMarkerRef.current) {
        const userIcon = L.divIcon({
          className: 'rooftop-marker-wrap',
          html: `<div class="user-gps-dot"><div class="user-gps-halo"></div><div class="user-gps-inner"></div></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        leafletUserMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000
        }).addTo(map);
      } else {
        leafletUserMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }

      // Fade out and remove markers that are no longer visible
      leafletMarkersMapRef.current.forEach((marker, id) => {
        if (!visibleIds.has(id)) {
          if (!leafletExitTimersRef.current.has(id)) {
            const el = marker.getElement();
            const anchor = el?.querySelector('.rooftop-pill-anchor');
            if (anchor) anchor.classList.add('is-exiting');
            const timer = window.setTimeout(() => {
              map.removeLayer(marker);
              leafletMarkersMapRef.current.delete(id);
              leafletExitTimersRef.current.delete(id);
            }, 220);
            leafletExitTimersRef.current.set(id, timer);
          }
        }
      });

      // Add new markers or update selection state on existing ones without recreating DOM nodes
      visibleLandmarks.forEach((lm, idx) => {
        const existingTimer = leafletExitTimersRef.current.get(lm.id);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
          leafletExitTimersRef.current.delete(lm.id);
        }

        const existingMarker = leafletMarkersMapRef.current.get(lm.id);
        if (existingMarker) {
          const el = existingMarker.getElement();
          const anchor = el?.querySelector('.rooftop-pill-anchor');
          if (anchor) {
            anchor.classList.remove('is-exiting');
            anchor.classList.toggle('is-selected', selectedId === lm.id);
          }
          existingMarker.setZIndexOffset(selectedId === lm.id ? 950 : 500 - idx * 10);
          existingMarker.off('click');
          existingMarker.on('click', () => handleSelectLandmark(lm.id));
        } else {
          const icon = L.divIcon({
            className: 'rooftop-marker-wrap',
            html: createRooftopPillHTML(lm, selectedId === lm.id),
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          });
          const marker = L.marker([lm.lat, lm.lng], {
            icon,
            zIndexOffset: selectedId === lm.id ? 950 : 500 - idx * 10
          }).addTo(map);

          const el = marker.getElement();
          const anchor = el?.querySelector('.rooftop-pill-anchor');
          if (anchor) {
            anchor.classList.add('is-entering');
            requestAnimationFrame(() => {
              anchor.classList.remove('is-entering');
            });
          }

          marker.on('click', () => handleSelectLandmark(lm.id));
          leafletMarkersMapRef.current.set(lm.id, marker);
        }
      });

      schedulePillCollisionResolution();
    }
  }, [visibleLandmarks, selectedId, userLocation, engine, mapLoaded]);

  const handleSelectLandmark = async (landmarkId: string) => {
    const lm = landmarkPool.find((l) => l.id === landmarkId);
    if (!lm) return;

    setSelectedId(lm.id);

    if (engine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat: lm.lat, lng: lm.lng });
    } else if (leafletMapRef.current) {
      leafletMapRef.current.panTo([lm.lat, lm.lng], { animate: true, duration: 0.4 });
    }

    const cacheKey = lm.wikiTitle || lm.id;
    if (!wikiCacheRef.current.has(cacheKey)) {
      try {
        const gallery = await fetchBuildingPhotoGallery(
          lm.wikiTitle,
          lm.name,
          lm.photos,
          lm.fallbackImg
        );
        wikiCacheRef.current.set(cacheKey, gallery);
        if (gallery.length > 0) {
          setLandmarkPool((prev) =>
            prev.map((item) =>
              item.id === lm.id
                ? {
                    ...item,
                    fallbackImg: gallery[0],
                    photos: gallery
                  }
                : item
            )
          );
        }
      } catch (_) {}
    }
  };

  const pinpointMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not available on this device.');
      return;
    }
    showToast('Locating your position...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });

        if (engine === 'google' && googleMapRef.current) {
          googleMapRef.current.setCenter({ lat, lng });
          googleMapRef.current.setZoom(17);
        } else if (leafletMapRef.current) {
          leafletMapRef.current.setView([lat, lng], 17);
        }
        await spotBuildingsAround(lat, lng, 700, false);
      },
      () => {
        showToast('Location permission denied — pan the map and tap Spot Here.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSpotCurrentView = () => {
    let center = userLocation;
    if (engine === 'google' && googleMapRef.current) {
      const c = googleMapRef.current.getCenter();
      if (c) center = { lat: c.lat(), lng: c.lng() };
    } else if (leafletMapRef.current) {
      const c = leafletMapRef.current.getCenter();
      center = { lat: c.lat, lng: c.lng };
    }
    const radius = viewportBounds
      ? Math.max(
          400,
          Math.round(
            computeDistanceMeters(
              viewportBounds.south,
              viewportBounds.west,
              viewportBounds.north,
              viewportBounds.east
            ) / 2
          )
        )
      : 800;
    setUserLocation(center);
    spotBuildingsAround(center.lat, center.lng, radius, false);
  };

  const selectedLandmark = landmarkPool.find((l) => l.id === selectedId) || null;

  return (
    <>
      <main className="map-viewport" aria-label="Interactive Map">
        <div
          ref={googleContainerRef}
          id="google-map"
          className={`map-canvas ${engine === 'google' ? '' : 'hidden'}`}
        />
        <div
          ref={leafletContainerRef}
          id="leaflet-map"
          className={`map-canvas ${engine === 'leaflet' ? '' : 'hidden'}`}
        />
      </main>

      <header className="floating-top-bar">
        <button
          type="button"
          id="scan-area-btn"
          className="floating-action-pill"
          title="Spot landmarks and buildings in this map view"
          onClick={handleSpotCurrentView}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Spot Here</span>
        </button>
      </header>

      <button
        type="button"
        id="locate-me-btn"
        className="locate-fab"
        aria-label="Pinpoint my location"
        title="Pinpoint my location"
        onClick={pinpointMe}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="12" y1="2" x2="12" y2="5"></line>
          <line x1="12" y1="19" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="5" y2="12"></line>
          <line x1="19" y1="12" x2="22" y2="12"></line>
        </svg>
      </button>

      <BuildingCard
        landmark={selectedLandmark}
        userLocation={userLocation}
        onClose={() => setSelectedId(null)}
      />

      <div
        id="status-toast"
        className={`status-toast ${toastMsg ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg || ''}
      </div>
    </>
  );
};
