import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { fetchMoreDetails } from '../components/tmdbService';
import { Dimensions } from 'react-native';
import { commonStyles } from '../utils/commonStyles';

// Get the screen's width
const screenWidth = Dimensions.get('window').width;

// Calculate the width and height for the poster
const posterWidth = screenWidth * 0.5; // 50% of the screen width
const aspectRatio = 2 / 3; // Typical poster aspect ratio
const posterHeight = posterWidth / aspectRatio;

const MovieDetailScreen = ({ route, navigation }) => {
    const { movie } = route.params;
    const [fullMovieDetails, setFullMovieDetails] = useState(null);

    // Consolidated the fetching logic and error handling
    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const additionalDetails = await fetchMoreDetails(movie.id);
                if (additionalDetails) {
                    setFullMovieDetails({ ...movie, ...additionalDetails });
                }
            } catch (error) {
                console.error("Failed to fetch additional movie details: ", error);
            }
        };
        getMovieDetails();
    }, [movie]);

    // Loading state
    if (!fullMovieDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Helper function directly within return statement for genres
    const renderGenres = (genres) => {
      if (genres && Array.isArray(genres)) {
        const genreNames = genres.map(genre => genre.name).join(', ');
        return genreNames;
      }
      return '';
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Image source={{ uri: movie.posterPath }} style={styles.posterImage} />
            <View style={styles.detailContainer}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.genre}>{renderGenres(fullMovieDetails.genres)}</Text>
                <Text style={styles.overview}>{fullMovieDetails.overview}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.button}>
                    <Text style={commonStyles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F2F8',
    },
    contentContainer: { 
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailContainer: {
        padding: 20,
        alignItems: 'center',
    },
    genre: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 10,
        textAlign: 'center',
    },
    overview: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'justify',
    },
    posterImage: {
        width: posterWidth,
        height: posterHeight,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default MovieDetailScreen;
