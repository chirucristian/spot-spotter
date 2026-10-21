import React, { useCallback, useEffect } from 'react';
import { Coordinates, CitySearchResult } from './types';
import { computeDistanceMeters } from './utils/distance';
import { useToast } from './hooks/useToast';
import { useGeolocation } from './hooks/useGeolocation';
import { useLandmarkPool } from './hooks/useLandmarkPool';
import { useMapController } from './components/map/useMapController';
import { MapCanvas } from './components/map/MapCanvas';
import { BuildingCard } from './components/BuildingCard';
import { TopBar } from './components/ui/TopBar';
import { LocateFab } from './components/ui/LocateFab';
import { Toast } from './components/ui/Toast';

export {
  schedulePillCollisionResolution,
  resolvePillCollisions
} from './components/map/rooftopPills';

export const App: React.FC = () => {
  const { toastMsg, showToast } = useToast();

  // Temporary ref for map controller methods needed in callbacks before full declaration
  const mapActionsRef = React.useRef<{
    panTo: (coords: Coordinates) => void;
    flyTo: (coords: Coordinates, zoom?: number) => void;
    setCenterAndZoom: (coords: Coordinates, zoom?: number) => void;
    getCurrentCenter: () => Coordinates;
  }>({
    panTo: () => {},
    flyTo: () => {},
    setCenterAndZoom: () => {},
    getCurrentCenter: () => ({ lat: 60.1699, lng: 24.9525 })
  });

  const handlePositionFound = useCallback(
    async (coords: Coordinates) => {
      mapActionsRef.current.setCenterAndZoom(coords, 17);
      await spotBuildingsAround(coords.lat, coords.lng, 700, false);
    },
    [] // spotBuildingsAround will be bound via ref below
  );

  const { userLocation, pinpointMe } = useGeolocation({
    showToast,
    onPositionFound: handlePositionFound
  });

  const [currentZoom, setCurrentZoom] = React.useState<number>(16.5);
  const [viewportBounds, setViewportBounds] = React.useState<any>(null);

  const {
    landmarkPool,
    visibleLandmarks,
    selectedId,
    setSelectedId,
    selectedLandmark,
    isScanning,
    spotBuildingsAround,
    selectLandmark
  } = useLandmarkPool({
    showToast,
    currentZoom,
    viewportBounds
  });

  const spotBuildingsAroundRef = React.useRef(spotBuildingsAround);
  spotBuildingsAroundRef.current = spotBuildingsAround;

  const handleAutoScanNeeded = useCallback(
    (center: Coordinates, radius: number) => {
      spotBuildingsAroundRef.current(center.lat, center.lng, radius, true);
    },
    []
  );

  const handleSelectLandmark = useCallback(
    (landmarkId: string) => {
      const lm = landmarkPool.find((l) => l.id === landmarkId);
      if (lm) {
        mapActionsRef.current.panTo({ lat: lm.lat, lng: lm.lng });
      }
      selectLandmark(landmarkId);
    },
    [landmarkPool, selectLandmark]
  );

  const mapCtrl = useMapController({
    visibleLandmarks,
    selectedId,
    userLocation,
    onSelectLandmark: handleSelectLandmark,
    onAutoScanNeeded: handleAutoScanNeeded
  });

  // Keep actions ref updated with the map controller's imperatives
  mapActionsRef.current = {
    panTo: mapCtrl.panTo,
    flyTo: mapCtrl.flyTo,
    setCenterAndZoom: mapCtrl.setCenterAndZoom,
    getCurrentCenter: mapCtrl.getCurrentCenter
  };

  // Sync zoom and bounds from map controller to landmark pool
  useEffect(() => {
    setCurrentZoom(mapCtrl.currentZoom);
  }, [mapCtrl.currentZoom]);

  useEffect(() => {
    setViewportBounds(mapCtrl.viewportBounds);
  }, [mapCtrl.viewportBounds]);

  // Handle keyboard Escape to dismiss card
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, setSelectedId]);

  const handleSpotCurrentView = () => {
    const center = mapCtrl.getCurrentCenter();
    const radius = mapCtrl.viewportBounds
      ? Math.max(
          400,
          Math.round(
            computeDistanceMeters(
              mapCtrl.viewportBounds.south,
              mapCtrl.viewportBounds.west,
              mapCtrl.viewportBounds.north,
              mapCtrl.viewportBounds.east
            ) / 2
          )
        )
      : 800;
    spotBuildingsAround(center.lat, center.lng, radius, false);
  };

  const handleSelectCity = async (city: CitySearchResult) => {
    setSelectedId(null);
    showToast(`Exploring ${city.name}…`);
    mapCtrl.flyTo({ lat: city.lat, lng: city.lng }, 15.8);
    await spotBuildingsAround(city.lat, city.lng, 1500, false);
  };

  return (
    <>
      <MapCanvas
        engine={mapCtrl.engine}
        googleRef={mapCtrl.googleContainerRef}
        leafletRef={mapCtrl.leafletContainerRef}
      />

      <TopBar
        isScanning={isScanning}
        onSelectCity={handleSelectCity}
        onSpotCurrentView={handleSpotCurrentView}
      />

      <LocateFab
        isActive={Boolean(userLocation)}
        onLocate={pinpointMe}
      />

      <BuildingCard
        landmark={selectedLandmark}
        userLocation={userLocation}
        onClose={() => setSelectedId(null)}
      />

      <Toast message={toastMsg} />
    </>
  );
};
