/* eslint-disable prettier/prettier */
import Geolocation from '@react-native-community/geolocation';

type Coordinate = [number, number];
type ErrorCallback = (error: any) => void;

const getUserLocation = (onSuccess: (coords: Coordinate) => void, onError: ErrorCallback): void => {
  Geolocation.getCurrentPosition(
    (position: { coords: { latitude: any; longitude: any; }; }) => {
      const { latitude, longitude } = position.coords;
      onSuccess([longitude, latitude]);
    },
    (error: any) => {
      onError(error);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
  );
};

const watchUserLocation = (onLocationChange: (coords: Coordinate) => void, onError: ErrorCallback): number => {
  return Geolocation.watchPosition(
    (position: { coords: { latitude: any; longitude: any; }; }) => {
      const { latitude, longitude } = position.coords;
      onLocationChange([longitude, latitude]);
    },
    (error: any) => {
      onError(error);
    },
    { enableHighAccuracy: true, distanceFilter: 20 }
  );
};

const clearLocationWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

export { getUserLocation, watchUserLocation, clearLocationWatch };
