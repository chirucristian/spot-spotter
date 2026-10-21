import { useCallback, useEffect, useRef, useState } from 'react';
import { Coordinates } from '../types';

interface UseGeolocationOptions {
  showToast: (msg: string) => void;
  onPositionFound?: (coords: Coordinates) => void;
}

export function useGeolocation({ showToast, onPositionFound }: UseGeolocationOptions) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const pinpointMe = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation not available on this device.');
      return;
    }
    showToast('Locating your position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        onPositionFound?.(coords);

        if (watchIdRef.current === null && navigator.geolocation) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (p) => {
              setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 10000 }
          );
        }
      },
      () => {
        showToast('Location permission denied — pan the map and tap Spot Here.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [showToast, onPositionFound]);

  return {
    userLocation,
    pinpointMe
  };
}
