/* eslint-disable prettier/prettier */
import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';

// Import the orientation image
import orientationImage from '../../assets/north.png';

interface NorthButtonProps {
  cameraRef: React.RefObject<any>;
}

const NorthUser: React.FC<NorthButtonProps> = ({ cameraRef }) => {
  // Function to handle the button press to set orientation to north.
  const handleSetOrientationToNorth = () => {
    if (cameraRef.current) {
      // Define camera options to set heading to 0 for north.
      const options = {
        heading: 0,
        animationDuration: 500,
      };
      // Set the camera to the specified options.
      cameraRef.current.setCamera(options);
    }
  };

  return (
    <TouchableOpacity style={styles.directionsButton} onPress={handleSetOrientationToNorth}>
      {/* White circle container */}
      <View style={styles.iconContainer}>
        {/* Orientation icon */}
        <Image source={orientationImage} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  directionsButton: {
    position: 'absolute',
    top: 150,
    right: 15,
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default NorthUser;
