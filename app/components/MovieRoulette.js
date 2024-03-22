import React, { useState, useRef } from 'react';
import { Svg, Path, Polygon, Text as SvgText } from 'react-native-svg';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { commonStyles } from '../utils/commonStyles';

// Define fixed array of complementary colors
const colors = ['#FF00A5', '#8300F8', '#FADA00', '#3AA3FF', '#FC4519', '#00FF5A', '#7CFF07', '#0525FF', '#C55C00', '#03BAE6'];

// Shuffle array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    // Pick remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap with current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const MovieRoulette = ({ radius, selectedMovies }) => {
  const spinValue = useRef(new Animated.Value(0)).current; // Using useRef to persist the animated value
  const shuffledColors = shuffleArray([...colors]);

  // Adjust function to draw each slice based on the number of selectedMovies
  const drawSlice = (idx, total) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = idx * angle;
    const endAngle = startAngle + angle;

    // Calculate the path for each slice of the wheel
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const pathData = [
      `M ${radius} ${radius}`, // Move to center
      `L ${x1} ${y1}`, // Draw line to the start of the arc
      `A ${radius} ${radius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 ${x2} ${y2}`, // Arc
      `Z` // Close path
    ].join(' ');

    return <Path
      key={idx}
      d={pathData}
      fill={shuffledColors[idx % shuffledColors.length]}
      stroke="black"
      strokeWidth="2" />;
  };

  // Function to animate the spinning of the wheel
  const spinWheel = () => {
    // Calculate end degrees dynamically
    const spins = 2 + Math.random() * 3; // Between 2 to 5 spins
    const degreesPerMovie = 360 / selectedMovies.length;
    const randomStop = Math.floor(Math.random() * selectedMovies.length);
    const endDegrees = 360 * spins + degreesPerMovie * randomStop;

    // Resetting to 0 for a consistent starting point
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: endDegrees, // Use the dynamic endDegrees for a full spin
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  // Interpolate spin value to degrees for rotation
  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const wheelStyles = {
    transform: [{ rotate: spinInterpolate }],
  };

  // Draw movie title within each slice
    const drawMovieTitle = (idx, total, movie) => {
    const angle = (2 * Math.PI) / total; // Angle per slice
    const startAngle = idx * angle;
    const endAngle = startAngle + angle;
    const middleAngle = startAngle + (endAngle - startAngle) / 2;
    
    // Calculate the text position
    const textRadius = radius * 0.7; // Adjust this value to move the text closer or further from the center
    const x = radius + textRadius * Math.cos(middleAngle) - (radius * 0.1);
    const y = radius + textRadius * Math.sin(middleAngle) + (radius * 0.1);

    
    return (
      <SvgText
        key={`text-${idx}`}
        x={x}
        y={y}
        fill="black"
        fontSize="15"
        fontWeight="bold"
        textAnchor="middle" // Align text in the middle
        transform={`rotate(${middleAngle * (180 / Math.PI)}, ${x}, ${y})`} // Rotate text to align with the slice
      >
        {movie.title}
      </SvgText>
    );
  };

  
// Function to draw the central pointer
const drawCentralPointer = (
  <Svg height="30" width="30" viewBox="0 0 30 30">
      <Polygon
        points="15,0 5,30 25,30"
        fill="black"
      />
    </Svg>
);


  return (
    <View style={styles.container}>
      <View style={styles.pointerContainer}>
        {drawCentralPointer}
      </View>

      <Animated.View style={wheelStyles}>
        <Svg height={radius * 2.2} width={radius * 2.2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            {selectedMovies.map((movie, idx) => drawSlice(idx, selectedMovies.length))}
            {selectedMovies.map((movie, idx) => drawMovieTitle(idx, selectedMovies.length, movie))}
        </Svg>
      </Animated.View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}
        onPress={spinWheel}
      >
        Spin the Wheel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 30,
    backgroundColor: '#F7F2F8',
  },

  button: {
    marginTop: 50,
    backgroundColor: '#A9A9A9',
    padding: 15,
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },

  pointerContainer: {
    position: 'absolute',
    top: '39%',
    zIndex: 1, // Ensure it's above the wheel
  },

  wheel: {
    marginBottom: 30,
  },
});

export default MovieRoulette;