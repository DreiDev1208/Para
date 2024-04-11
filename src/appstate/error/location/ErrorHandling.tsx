/* eslint-disable prettier/prettier */
// ErrorHandling.ts
import { Platform } from 'react-native';
import { isLocationEnabled, promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { getUserLocation } from '../../../components/getlocation/userlocation';

export const showEnableLocationPopup = async (
  handleLocationSuccess: (location: [number, number]) => void,
  handleLocationError: (error: any) => void
) => {
  if (Platform.OS === 'android') {
    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      if (enableResult === 'enabled' || enableResult === 'already-enabled') {
        // User enabled location or it was already enabled, continue with your logic
        // Set and populate user location
        getUserLocationAndHandleErrors(handleLocationSuccess, handleLocationError);
      } else {
        // User did not enable location, handle as needed
      }
    } catch (error) {
      console.error('Error enabling location:', error);
    }
  }
};

const getUserLocationAndHandleErrors = async (
  handleLocationSuccess: (location: [number, number]) => void,
  handleLocationError: (error: any) => void
) => {
  getUserLocation(
    (location: [number, number]) => {
      handleLocationSuccess(location);
    },
    (error: any) => {
      handleLocationError(error);
    }
  );
};

export const ErrorLocationHandler = async (
  handleLocationSuccess: (location: [number, number]) => void,
  handleLocationError: (error: any) => void
) => {
  console.log('Checking if location is enabled...');
  if (Platform.OS === 'android') {
    isLocationEnabled()
      .then((enabled: any) => {
        if (!enabled) {
          showEnableLocationPopup(handleLocationSuccess, handleLocationError);
        } else {
          console.log('Location is enabled.');

          getUserLocationAndHandleErrors(handleLocationSuccess, handleLocationError);
        }
      })
      .catch((error: any) => {
        console.error('Error checking location status:', error);
      });
  }
};

export default ErrorLocationHandler;
