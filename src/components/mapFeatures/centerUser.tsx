/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import userLocationImage from '../../assets/userLocation.png';

const CenterUser: React.FC<{ userLocation: [number, number] | null; cameraRef: React.RefObject<any>; }> = ({ userLocation, cameraRef }) => {
  const handleRecenterPress = () => {
    if (userLocation && cameraRef && cameraRef.current) {
      const options = {
        centerCoordinate: userLocation,
        heading: 0,
        zoomLevel: 17,
        animationDuration: 2000,
      };
      cameraRef.current.setCamera(options);
    }
  };

  return (
    <TouchableOpacity style={styles.recenterButton} onPress={handleRecenterPress}>
      <View style={styles.iconContainer}>
        <Image source={userLocationImage} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recenterButton: {
    position: 'absolute',
    bottom: 80,
    right: 12,
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});

export default CenterUser;
