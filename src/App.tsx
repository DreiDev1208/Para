import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeScreen from './screens/homescreen';

const App: React.FC = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

export default App;
