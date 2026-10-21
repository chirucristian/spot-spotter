import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DEFAULT_GMAPS_KEY, CIVIC_SQUARES } from '../../data/squares';
import { Coordinates, Landmark, MapBoundsBox } from '../../types';
import { computeDistanceMeters } from '../../utils/distance';
import {
  createRooftopPillHTML,
  getMobileAwareZoom,
  schedulePillCollisionResolution
} from './rooftopPills';

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

interface UseMapControllerOptions {
  visibleLandmarks: Landmark[];
  selectedId: string | null;
  userLocation: Coordinates | null;
  onSelectLandmark: (id: string) => void;
  onAutoScanNeeded: (center: Coordinates, radius: number) => Promise<boolean> | void;
}

export function useMapController({
  visibleLandmarks,
  selectedId,
  userLocation,
  onSelectLandmark,
  onAutoScanNeeded
}: UseMapControllerOptions) {
  const initialSquare = CIVIC_SQUARES['senate-helsinki'];

  const [engine, setEngine] = useState<'google' | 'leaflet'>('google');
  const [currentZoom, setCurrentZoom] = useState<number>(
    getMobileAwareZoom(initialSquare.zoom)
  );
  const [viewportBounds, setViewportBounds] = useState<MapBoundsBox | null>(null);
  const [mapLoaded, setMapLoaded] = useState<number>(0);

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

  const queriedRegionsRef = useRef<Array<{ lat: number; lng: number; radius: number }>>([]);
  const autoScanTimerRef = useRef<number | null>(null);

  const syncViewportState = useCallback(
    (
      center: Coordinates,
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
          const region = { lat: center.lat, lng: center.lng, radius };
          // Reserve the region up-front to avoid duplicate in-flight scans,
          // but release it if the scan failed so the area is retried later.
          queriedRegionsRef.current.push(region);
          Promise.resolve(onAutoScanNeeded(center, radius)).then((ok) => {
            if (ok === false) {
              queriedRegionsRef.current = queriedRegionsRef.current.filter((q) => q !== region);
            }
          });
        }
      }, 320);
    },
    [onAutoScanNeeded]
  );

  // Initialize Map SDKs
  useEffect(() => {
    let cancelled = false;

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
  }, [syncViewportState]);

  // Reconcile markers & overlays
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

      if (userLocation) {
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
          (googleUserOverlayRef.current as any).setMap(map);
          googleUserOverlayRef.current.draw();
        }
      } else if (googleUserOverlayRef.current) {
        (googleUserOverlayRef.current as any).setMap(null);
        googleUserOverlayRef.current = null;
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
          existingOv.onClick = () => onSelectLandmark(lm.id);
        } else {
          const ov = new RooftopOverlay(
            { lat: lm.lat, lng: lm.lng },
            createRooftopPillHTML(lm, selectedId === lm.id),
            () => onSelectLandmark(lm.id)
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

      if (userLocation) {
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
          if (!map.hasLayer(leafletUserMarkerRef.current)) {
            leafletUserMarkerRef.current.addTo(map);
          }
        }
      } else if (leafletUserMarkerRef.current) {
        map.removeLayer(leafletUserMarkerRef.current);
        leafletUserMarkerRef.current = null;
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
          existingMarker.on('click', () => onSelectLandmark(lm.id));
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

          marker.on('click', () => onSelectLandmark(lm.id));
          leafletMarkersMapRef.current.set(lm.id, marker);
        }
      });

      schedulePillCollisionResolution();
    }
  }, [visibleLandmarks, selectedId, userLocation, engine, mapLoaded, onSelectLandmark]);

  const panTo = useCallback(
    (coords: Coordinates) => {
      if (engine === 'google' && googleMapRef.current) {
        googleMapRef.current.panTo(coords);
      } else if (leafletMapRef.current) {
        leafletMapRef.current.panTo([coords.lat, coords.lng], { animate: true, duration: 0.4 });
      }
    },
    [engine]
  );

  const flyTo = useCallback(
    (coords: Coordinates, zoom = 15.8) => {
      if (engine === 'google' && googleMapRef.current) {
        googleMapRef.current.panTo(coords);
        googleMapRef.current.setZoom(zoom);
      } else if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([coords.lat, coords.lng], zoom, {
          duration: 1.2
        });
      }
    },
    [engine]
  );

  const setCenterAndZoom = useCallback(
    (coords: Coordinates, zoom = 17) => {
      if (engine === 'google' && googleMapRef.current) {
        googleMapRef.current.setCenter(coords);
        googleMapRef.current.setZoom(zoom);
      } else if (leafletMapRef.current) {
        leafletMapRef.current.setView([coords.lat, coords.lng], zoom);
      }
    },
    [engine]
  );

  const getCurrentCenter = useCallback((): Coordinates => {
    if (engine === 'google' && googleMapRef.current) {
      const c = googleMapRef.current.getCenter();
      if (c) return { lat: c.lat(), lng: c.lng() };
    } else if (leafletMapRef.current) {
      const c = leafletMapRef.current.getCenter();
      if (c) return { lat: c.lat, lng: c.lng };
    }
    return initialSquare.center;
  }, [engine, initialSquare.center]);

  return {
    engine,
    currentZoom,
    viewportBounds,
    googleContainerRef,
    leafletContainerRef,
    panTo,
    flyTo,
    setCenterAndZoom,
    getCurrentCenter
  };
}
