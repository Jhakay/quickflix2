
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MovieRoulette from '../components/MovieRoulette';

const WheelScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wheel</Text>
      <MovieRoulette radius={150} segments={6} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#ADD8E6', 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
  },
});

export default WheelScreen;