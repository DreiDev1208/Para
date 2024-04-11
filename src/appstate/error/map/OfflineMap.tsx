/* eslint-disable prettier/prettier */
// services/offlineMap.ts
import Mapbox, { offlineManager } from '@rnmapbox/maps';

// Function to check if offline map tiles exist for the given location,
// and download them if not.
const OfflineMap = async (location: [number, number]) => {
  try {
    const offlinePacks = await offlineManager.getPacks();

    if (offlinePacks.length === 0) {
      await downloadOfflineMap(location);
    } else {
      console.log('Offline map tiles already exist.');
    }
  } catch (error) {
    console.error('Error checking offline map:', error);
  }
};

// Function to download offline map tiles for the specified location.
const downloadOfflineMap = async (location: [number, number]) => {
  try {
    if (location) {
      // Define a region for the offline map download.
        const region = {
            ne: [location[0] + 0.01, location[1] + 0.01],
            sw: [location[0] - 0.01, location[1] - 0.01],
        };

      // Create the offline map pack.
        const progressListener = (offlineRegion: any, status: any) => console.log(offlineRegion, status);
        const errorListener = (offlineRegion: any, err: any) => console.log(offlineRegion, err);

        await Mapbox.offlineManager.createPack({
        name: 'offlinePack',
        styleURL: 'mapbox://styles/dreidev0217/clmrhcbd4021901rf24yj5qul',
        minZoom: 10,
        maxZoom: 16,
        bounds: [
            [region.sw[1], region.sw[0]],
            [region.ne[1], region.ne[0]],
          ],
        }, progressListener, errorListener);

      // Subscribe to download progress and completion events.
      await offlineManager.subscribe(
        'offlinePack',
        (offlinePack: any, status: any) => {
          if (status === 'offlinePackProgress') {
            console.log(`Downloading: ${offlinePack.name} - ${offlinePack.progress}%`);
          } else if (status === 'offlinePackComplete') {
            console.log(`Download complete: ${offlinePack.name}`);
          }
        },
        (offlinePack: any, err: any) => {
          console.error(`Error downloading ${offlinePack.name}: ${err}`);
        }
      );

      console.log('Offline map tiles download initiated.');
    }
  } catch (error) {
    console.error('Error downloading offline map tiles:', error);
  }
};

export default OfflineMap;
