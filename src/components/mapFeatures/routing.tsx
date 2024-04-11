/* eslint-disable prettier/prettier */
  const RouterFeature = (coordinates: [number, number][] | null | undefined) => {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates,
                },
            },
        ],
    };
  };


  const RouterLine = async (userLocation: [number, number], iotLocation: [number, number], APIKEY: string) => {
    const startCoordinates = `${userLocation[0]},${userLocation[1]}`;
    const endCoordinates = `${iotLocation[0]},${iotLocation[1]}`;
    const routeProfile = 'driving';
    const geometries = 'geojson';
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeProfile}/${startCoordinates};${endCoordinates}?alternatives=true&geometries=${geometries}&access_token=${APIKEY}`;
    try {
        let response = await fetch(url);
        let json = await response.json();
        if (!json || !json.routes || !json.routes.length) {
            return null;
        }
        let coordinates = json.routes[0].geometry.coordinates;
        if (!coordinates || !coordinates.length) {
            return null;
        }
        const routerFeature = RouterFeature([...coordinates]);
        if (!routerFeature) {
            return null;
        }
        return routerFeature;
    } catch (e) {
        return null;
    }
  };

  const CalculateDistance = (routeCoordinates: [number, number][]) => {
    let distance = 0;

    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const lat1 = routeCoordinates[i][1];
      const lon1 = routeCoordinates[i][0];
      const lat2 = routeCoordinates[i + 1][1];
      const lon2 = routeCoordinates[i + 1][0];
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const segmentDistance = R * c;
      distance += segmentDistance;
    }

    return distance;
  };
export { RouterFeature, RouterLine, CalculateDistance };
