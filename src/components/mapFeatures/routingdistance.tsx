/* eslint-disable prettier/prettier */
const CalculateSpeed = (prevRouteDistance: number | null, routeDistance: number | null, setSpeed: React.Dispatch<React.SetStateAction<number | null>>, setETA: React.Dispatch<React.SetStateAction<number | null>>, prevTimestampRef: React.MutableRefObject<number | null>) => {
    if (prevRouteDistance !== null && routeDistance !== null) {
      const currentTimestamp = Date.now();
      const prevTimestamp = prevTimestampRef.current;

      if (prevTimestamp) {
        const timeInSeconds = (currentTimestamp - prevTimestamp) / 1000;
        const distanceTraveled = routeDistance - prevRouteDistance;
        const expectedSpeed = Math.abs(distanceTraveled * 1000) / timeInSeconds;
        const eta = (routeDistance * 1000) / expectedSpeed;

        const minutes = Math.floor(eta / 60);
        setSpeed(Math.round(((expectedSpeed * 100) / 100) * 3600) / 1000);
        setETA(minutes);

        console.log('Speed:', expectedSpeed, 'm/s');
        console.log('ETA:', minutes, 'minutes');
      }

      prevTimestampRef.current = currentTimestamp;
    }
  };
export default CalculateSpeed;
