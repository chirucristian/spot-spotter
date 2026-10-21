import React from 'react';

interface MapCanvasProps {
  engine: 'google' | 'leaflet';
  googleRef: React.RefObject<HTMLDivElement | null>;
  leafletRef: React.RefObject<HTMLDivElement | null>;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  engine,
  googleRef,
  leafletRef
}) => {
  return (
    <main className="map-viewport" aria-label="Interactive Map">
      <div
        ref={googleRef}
        id="google-map"
        className={`map-canvas ${engine === 'google' ? '' : 'hidden'}`}
      />
      <div
        ref={leafletRef}
        id="leaflet-map"
        className={`map-canvas ${engine === 'leaflet' ? '' : 'hidden'}`}
      />
    </main>
  );
};
