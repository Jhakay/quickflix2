import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import {fetchMoreDetails} from '../components/tmdbService';

const MovieDetailScreen = ({ route, navigation }) => {
    const { movie } = route.params;

    const [fullMovieDetails, setFullMovieDetails] = useState(null);

    const renderGenres = (genres) => {
      return genres ? genres.join(', ') : '';
    };

    useEffect(() => {
      const getMovieDetails = async () => {
        const additionalDetails = await fetchMoreDetails(movie.id);
        if (additionalDetails) {
          setFullMovieDetails({ ...movie, ...additionalDetails});
        } else {
          //Error handler here
        }
      };
      getMovieDetails();
    }, [movie]);
 
    if (!fullMovieDetails) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer} 
          >
            <Image source={{ uri: movie.posterPath }} style={styles.posterImage} />
            <View style={styles.detailContainer}>
            <Text style={styles.title}>{movie.title}</Text>

            {/* Genre */}
            <Text style={styles.genre}>{renderGenres(movie.genres)}</Text>

            {/* Overview */}
            <Text style={styles.overview}>{movie.overview}</Text>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
      );
    };

    const styles = StyleSheet.create({
        button: {
          marginTop: 20,
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          alignSelf: 'center',
        },
      
        buttonText: {
          color: 'white',
          fontSize: 18,
        },

        container: {
          flex: 1,
          backgroundColor: 'white',
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
          width: '100%',
          height: 300,
          resizeMode: 'cover'
        },

        title: {
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 10,
        },

        
        
        // Add styles for additional details
      });
      
      export default MovieDetailScreen;