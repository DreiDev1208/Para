/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { APIKEY } from '../utils/key';
import { styles } from '../styles/HomeScreen';
import { getUserLocation, watchUserLocation, clearLocationWatch } from '../components/getlocation/userlocation';
import VehicleLocation from '../components/getlocation/vehiclelocation';
import NorthUser from '../components/mapFeatures/northUser';
import CenterUser from '../components/mapFeatures/centerUser';
import CalculateSpeed from '../components/mapFeatures/routingdistance';
import { CalculateDistance, RouterLine } from '../components/mapFeatures/routing';
import DisplayDistance from '../components/mapFeatures/DisplayDistance';
import  ErrorLocationHandler, {showEnableLocationPopup} from '../appstate/error/location/ErrorHandling';
import HomeNavigation from '../components/navigation/HomeNavigation';
import OfflineMap from '../appstate/error/map/OfflineMap';
import ClearData from '../appstate/TerminatedState';

MapboxGL.setAccessToken(APIKEY);

const HomeScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [iotLocation, setIotLocation] = useState<[number, number]>([0, 0]);
  const [routeDirections, setRouteDirections] = useState<any>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [prevRouteDistance, setPrevRouteDistance] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [eta, setETA] = useState<number | null>(null);
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  const prevTimestampRef = useRef<number | null>(null);
  let locationWatchId: number | null = null;

  const updateRouteBasedOnLocations = useCallback(() => {
    if (userLocation[0] !== null && iotLocation[0] !== null) {
      RouterLine(userLocation, iotLocation, APIKEY)
        .then((routerFeature: any) => {
          setRouteDirections(routerFeature);
          const routeDistance = CalculateDistance(routerFeature.features[0].geometry.coordinates);
          setRouteDistance(Math.round(routeDistance * 100) / 100);
          console.log('Route Distance:', routeDistance);
        })
        .catch((error: any) => {
          console.error('Error creating route:', error);
        });
    }
  }, [userLocation, iotLocation]);

  const handleLocationSuccess = useCallback((location: [number, number]) => {
    setUserLocation(location);
    updateRouteBasedOnLocations();
    OfflineMap(location);
  }, [iotLocation]);
  
  const handleLocationError = useCallback((error: any) => {
    console.error(error);
    if (error.code === 'ERR00') {
        showEnableLocationPopup(handleLocationSuccess, handleLocationError);
    }
  }, []);

  const handleIotMarker = () => {
    console.log('IoT marker tapped');
  };

  useEffect(() => {
    if (prevTimestampRef.current === null && routeDistance !== null) {
      prevTimestampRef.current = Date.now();
    }
    CalculateSpeed(prevRouteDistance, routeDistance, setSpeed, setETA, prevTimestampRef);
    setPrevRouteDistance(routeDistance);
  }, [routeDistance]);

  useEffect(() => {
    ErrorLocationHandler(handleLocationSuccess, handleLocationError);

    VehicleLocation(setIotLocation);
    VehicleLocation(handleLocationError);
    
    getUserLocation(
      (location) => {
        handleLocationSuccess(location);
      },
      (error) => {
        handleLocationError(error);
      }
    );

    locationWatchId = watchUserLocation(handleLocationSuccess, handleLocationError);

    const clearLocationDataOnTerminateHandler = ClearData(() => {
      setUserLocation([0, 0]);
      setIotLocation([0, 0]);
    });

    return () => {
      if (locationWatchId !== null) {
        clearLocationWatch(locationWatchId);
      }

      clearLocationDataOnTerminateHandler();
    };
  }, []);

  useEffect(() => {
    updateRouteBasedOnLocations();
  }, [userLocation, iotLocation]);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL="mapbox://styles/dreidev0217/clmrhcbd4021901rf24yj5qul"
          zoomEnabled={true}
          rotateEnabled={true}
        >
          {userLocation[0] !== null && (
            <MapboxGL.Camera
              zoomLevel={17}
              centerCoordinate={userLocation}
              heading={0}
              pitch={60}
              animationMode="flyTo"
              animationDuration={3000}
              ref={cameraRef}
            />
          )}
          {userLocation[0] !== null && (
            <MapboxGL.PointAnnotation
              id="userLocation"
              coordinate={userLocation}
            >
              <View />
            </MapboxGL.PointAnnotation>
          )}
          {iotLocation[0] !== null && iotLocation[1] !== null && (
            <MapboxGL.PointAnnotation
              id="othermarker"
              coordinate={iotLocation}
              onSelected={handleIotMarker}
            >
              <View />
            </MapboxGL.PointAnnotation>
          )}
          {routeDirections && (
            <MapboxGL.ShapeSource id="line1" shape={routeDirections}>
              <MapboxGL.LineLayer
                id="routerLine01"
                style={{
                  lineColor: '#0097ff',
                  lineWidth: 4,
                }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
      </View>
      <CenterUser userLocation={userLocation} cameraRef={cameraRef} />
      <NorthUser cameraRef={cameraRef} />
      <HomeNavigation />
      <DisplayDistance distance={routeDistance} speed={speed} eta={eta} />
    </View>
  );
};
export default HomeScreen;

