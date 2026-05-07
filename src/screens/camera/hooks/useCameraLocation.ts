import { useEffect } from 'react';
import { useLocation } from 'react-native-vision-camera-location';

export function useCameraLocation() {
  const location = useLocation({
    accuracy: 'balanced',
    distanceFilter: 10,
  });

  useEffect(() => {
    if (!location.hasPermission) {
      (async () => {
        console.log('Requesting location permission...');
        const has = await location.requestPermission();
        console.log(`Location permission: ${has}`);
      })();
    }
  }, [location]);

  useEffect(() => {
    const l = location.currentLocation;
    if (l == null) return;
    console.log(`Location: ${l.latitude} ${l.longitude}`);
  }, [location.currentLocation]);

  return location;
}
