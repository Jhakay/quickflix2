import React, { useEffect, useState, useCallback } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, useWindowDimensions, Alert } from 'react-native';
import { commonStyles } from '../utils/commonStyles';
import axios from 'axios';
import { API_KEY } from '../../config.js';
import StarRating from '../components/StarRating.js';
import { getFirestore, collection, doc, writeBatch, setDoc } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const MovieProfilerScreen = ({ navigation, route }) => {
  
  //const navigation = useNavigation();
  
  //Initialise with an empty array
    const [movies, setMovies] = useState([]);
    const [movieRatings, setMovieRatings] = useState([]);
    const apiKey = API_KEY;

    const auth = getAuth();
    const firestore = getFirestore();
    const batch = writeBatch(firestore);
    const user = auth.currentUser; //Get the currently signed-in user

    //Fetch movies from multiple pages and concatenate the results.
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          let allMovies = [];
          const genreSet = new Set(); //Temporary addition to find the different genres
          const pagesToFetch = 5; //Fetch first 5 pages
          const uniqueIds = new Set();

          for (let page = 1; page <= pagesToFetch; page++) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`);
            //console.log(`Movies from TMDB page ${page}:`, response.data.results); // Log each page's results

            // Add genre ids to the set
            response.data.results.forEach(movie => {
              movie.genre_ids.forEach(genreId => genreSet.add(genreId));
            });

            //Filter out movies with duplicate IDs
            const uniqueMovies = response.data.results.filter(movie => !uniqueIds.has(movie.id));

            // Log the unique genre ids
            console.log('Unique genre ids:', Array.from(genreSet));

            //Add the IDs of the new unique movies to the Set
            uniqueMovies.forEach(movie => uniqueIds.add(movie.id));
            allMovies = allMovies.concat(uniqueMovies);
          }

          //Shuffle the combined list of movies
          allMovies = shuffleArray(allMovies);
          
          //Slice the first 30
          const moviesWithDetails = allMovies.slice(0, 50).map(movie => ({
            id: String(movie.id),
                  title: movie.title,
                  posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  rating: 0,
                  rated: false,   
                  genre_ids: movie.genre_ids,          
        }));
        setMovies(moviesWithDetails);
        setMovieRatings(moviesWithDetails);
      } catch (error) {
        console.error("Error fetching movies: ", error);
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);          
        } else if (error.request) {
          console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
      }
    };

  fetchMovies();
}, [apiKey]);

const handleRating = (movieId, rating) => {
  setMovieRatings(currentRatings =>
    currentRatings.map(movie =>
      movie.id === movieId ? { ...movie, rating: rating } : movie
    )
  );
};

const handleSaveRatings = useCallback(async () => {
  if (!user) {
    Alert.alert('Error', 'You must be logged in to save ratings.');
    return;
  }

  const ratingsRef = collection(firestore, 'users', user.uid, 'ratings');
  
  //Start new batch
  const batch = writeBatch(firestore);

  movieRatings.forEach((movie) => {
    const docRef = doc(ratingsRef, movie.id);
    batch.set(docRef, {
      id: movie.id,
      title: movie.title,
      posterPath: movie.posterPath,
      rating: movie.rating,
      genreIds: movie.genre_ids,
    });
    console.log(movie);
  });

  try {
    await batch.commit();
    Alert.alert('Success', 'Your movie ratings have been saved.', [
      {
        text: "OK",
        onPress: () => {
          //Retrieve callback from navigation parameters
          if (route.params?.onSaveRatings) {
            route.params.onSaveRatings();
          }
          navigation.goBack(); // Navigate back after saving
        },
      },
    ]);
  } catch (error) {
    console.error('Error saving movie ratings:', error);
    Alert.alert('Error', 'There was an error saving your movie ratings.');
  }
}, [movieRatings, user]);

const renderMovieItem = ({ item }) => (
  <View style={styles.movieContainer}>
    <Image source={{ uri: item.posterPath }} style={styles.movieImage} />
    <Text style={styles.movieTitle}>{item.title}</Text>
    <StarRating rating={item.rating || 0} onRatingPress={(starRating) => handleRating(item.id, starRating)} />
    
  </View>
);

// Get the window dimensions
const window = useWindowDimensions();
// Call getStyles() with current windows dimensions
const styles = getStyles(window);

    //Shuffle function
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    

  return (
    <View style={styles.containerWithStatusBar}>
        <StatusBar barStyle="dark-content" />
        <Text style={commonStyles.heading}>Movie Profiler</Text>
        <View style={styles.line} />
        <Text style={styles.subHeaderText}>Rate the movies you have seen!</Text>
            <FlatList
            data={movieRatings}
            renderItem={renderMovieItem}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            />

        <View style={styles.line} />

        <TouchableOpacity style={commonStyles.button} onPress={handleSaveRatings}>
          <Text style={commonStyles.buttonText}>Save</Text>
        </TouchableOpacity>

    </View>
  );
};

//Function that takes the window dimensions and returns the styles
const getStyles = (window) => {
    const responsiveSize = (size) => window.width * size / 100
    const spacing = 16;
    const responsiveWidth = (window.width / 2) - (spacing * 2);

    return StyleSheet.create({
        
        aboutLabel: {
        fontSize: 16,   
        fontWeight: 'bold',
        marginTop: responsiveSize(3),
        marginBottom: responsiveSize(2),
        textAlign: 'left',
        },
        
        containerWithStatusBar: {
            flex: 1,
            backgroundColor: '#F7F2F8',
            paddingTop: StatusBar.currentHeight,
            alignItems: 'center',
        },

        dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveSize(1),
        marginBottom: responsiveSize(2),
        },

        header: {
        marginBottom: responsiveSize(2),  
        },

        headerText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#171A1FFF',
        marginTop: 63,
            marginLeft: 141,
        },

        line: {
        height: 1.5,
        backgroundColor: '#D3D3D3',
        width: '100%',
        marginTop: responsiveSize(2),
        },

        pictureContainer: {
        marginBottom: 20,
        alignItems: 'center',
        },

        row: {
          flex: 1,
          justifyContent: "space-around",
        },

        subHeaderText: {
        fontSize: 20,
        lineHeight: 30,
        color: '#1E2128FF',
        marginTop: 11,
        marginLeft: 32,
        },

        text: {
        fontSize: responsiveSize(2.5),
        color: '#9095A1FF',
        marginBottom: responsiveSize(1.5),
        },

        movieContainer: {
          width: responsiveWidth,
          margin: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },

        movieImage: {
          width: '100%', 
          height: responsiveWidth * 1.5, 
          resizeMode: 'contain',
          borderRadius: 8,
        },

        movieTitle: {
          fontSize: responsiveSize(2),
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 8,
        },

        movieRating: {
          textAlign: 'center',
          color: 'grey',
          marginTop: 4,
        },
    });
};

export default MovieProfilerScreen;