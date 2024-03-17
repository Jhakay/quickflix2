import React, { useState } from 'react';
import { Svg, Path, Polygon } from 'react-native-svg';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';

//Define fixed array of complementary colours
const colors = ['#FF00A5', '#8300F8', '#FADA00', '#3AA3FF', '#FC4519', '#00FF5A', '#7CFF07', '#0525FF', '#C55C00', '#03BAE6'];
    
//Shuffle array
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
        
    while (currentIndex !== 0) {
    //Pick remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

    //swap with current element
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
    };

const MovieRoulette = ({ items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"], radius = 150 }) => {
    const [spinValue] = useState(new Animated.Value(0));

    // Shuffle the colors array to get a random order without repeats
    const shuffledColors = shuffleArray([...colors]);

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

        return <Path 
                key={idx} 
                d={pathData} 
                fill={shuffledColors[idx % shuffledColors.length]}
                stroke= "black"
                strokeWidth="2"/>;
    };

    //Function to animate the spinning of the wheel
    const spinWheel = () => {
        Animated.timing(spinValue, {
            toValue: 4,
            duration: 3000,
            useNativeDriver: true,
        }).start(() => {
            spinValue.setValue(0); // Reset for the next spin
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
            <View style={styles.clickerContainer}>
            <Svg height="30" width="30" viewBox="0 0 30 30" style={styles.clicker}>
                <Polygon
                points="0,15 30,0 30,30"
                fill="blue" // This is the color of the clicker
                stroke="black"
                strokeWidth="1"
                transform="rotate(15 15 15)"
                />
            </Svg>
            </View>
    
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

    clickerContainer: {
        position: 'absolute',
        top: '50%', // Adjust as necessary to position right above the wheel
        right: -20,
        transform: [{ translateY: -10 }],
      },

    wheel: {
        marginBottom: 30,
    },
  });

export default MovieRoulette;
