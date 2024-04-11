/* eslint-disable prettier/prettier */
import { AppState, AppStateStatus } from 'react-native';

const ClearData = (clearLocationData: () => void) => {
  const appStateChangeHandler = (newState: AppStateStatus) => {
    if (newState === 'inactive') {
      clearLocationData();
    }
  };

  const subscription = AppState.addEventListener('change', appStateChangeHandler);

  return () => {
    subscription.remove();
  };
};

export default ClearData;

