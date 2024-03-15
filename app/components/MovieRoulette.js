import React, { useState } from 'react';
import { Svg, Path } from 'react-native-svg';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';

const MovieRoulette = ({ items = [], radius }) => {
    const [spinValue] = useState(new Animated.Value(0));

    //Function to get random colour for each slice
    const getRandomColor = () => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    //Function to draw a single slice of the wheel
    const drawSlice = (idx, total) => {
        const angle = (2 * Math.PI)/total;
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

        return <Path key={idx} d={pathData} fill={getRandomColor()} />;
    };

    //Function to animate the spinning of the wheel
    const spinWheel = () => {
        Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
    }), start(() => {
            spinValue.setValue(0);
    });
    };

    //Interpolate spin value to degrees for rotation
    const spinInterpolate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const wheelStyles = {
        transform: [{ rotate: spinInterpolate}],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={wheelStyles}>
                <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                    {items.map((item, idx) => drawSlice(idx, items.length))}
                </Svg>
            </Animated.View>
    
            <TouchableOpacity style={styles.button} onPress={spinWheel}>
                <Text>Spin the Wheel</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
    },

    button: {
      marginTop: 20,
      backgroundColor: '#DDD',
      padding: 10,
    },

    wheel: {
        marginBottom: 30,
    },
  });

export default MovieRoulette;
