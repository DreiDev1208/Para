/* eslint-disable prettier/prettier */
 import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsDisplayProps {
  distance: number | null;
  speed: number | null;
  eta: number | null;
}

const DisplayDistance: React.FC<StatsDisplayProps> = ({ distance, speed, eta }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>DISTANCE</Text>
          <Text style={styles.space} />
          <Text style={styles.label}>SPEED</Text>
          <Text style={styles.space} />
          <Text style={styles.label}>ETA</Text>
        </View>
        <View style={styles.valueRow}>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{distance}</Text>
            <Text style={styles.unit}>km</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{speed}</Text>
            <Text style={styles.unit}>km/h</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.value}>{eta}</Text>
            <Text style={styles.unit}>min</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 15,
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'column',
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    right: 10,
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueColumn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  space: {
    marginHorizontal: 35,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  unit: {
    fontSize: 16,
    color: '#333',
  },
});

export default DisplayDistance;
