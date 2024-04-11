/* eslint-disable prettier/prettier */
import { MqttClient } from '../../services/mqttClient';

type SetIotLocation = (location: [number, number]) => void;

const VehicleLocation = (setIotLocation: SetIotLocation): (() => void) => {
  try {
    MqttClient.connectAndInitialize();

    const handleNewLocation = (locationData: string) => {
      const [longitude, latitude] = locationData.split(',');
      setIotLocation([parseFloat(latitude), parseFloat(longitude)]);
      console.log('newLocation:', locationData);
    };
    MqttClient.eventEmitter.on('newLocation', handleNewLocation);

    return () => {
      MqttClient.eventEmitter.removeListener('newLocation', handleNewLocation);
    };
  } catch (error) {
    console.error(error);
    return () => {};
  }
};

export default VehicleLocation;
