import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import moodGenreMapping from '../components/moodGenreMapping';

const windowWidth = Dimensions.get('window').width;

// shuffleArray function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Define the moods
const moods = ['Happy', 'Excited', 'Romantic', 'Inspired', 'Thrilled', 'Scared/Spooky', 'Thoughtful/Reflective', 'Adventurous', 'Nostalgic', 'Solemn'];

const MoodsMoviesScreen = ( {selectedForWheel, setSelectedForWheel, navigation}) => {
  const [selectedMood, setSelectedMood] = useState({});
  const [movies, setMovies] = useState([]);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [numColumns, setNumColumns] = useState(2); //For grid layout
  const [error, setError] = useState(' ');

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user) {
        console.log('User not logged in');
        return;
      }

      try {
        // Simplify the initial query to fetch all movies for debugging
        const allMoviesQuery = query(collection(firestore, 'users', user.uid, 'ratings'));
        const querySnapshot = await getDocs(allMoviesQuery);
        let fetchedMovies = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            posterPath: doc.data().posterPath,
            rating: doc.data().rating,
        }));

        // Shuffle and slice to simulate a random selection of movies
        fetchedMovies = shuffleArray(fetchedMovies).slice(0, 12);
        console.log(fetchedMovies); // Debug: Check the fetched movies
        setMovies(fetchedMovies);

        //DEBUG
        console.log('Fetched movies:', fetchedMovies);
        setError(' ');
        setMovies(fetchedMovies);

    } catch (error) {
        console.error("Error fetching movies:", error);
        setError(error.message);
        Alert.alert("Error", "Failed to fetch movies: " + error.message);
    }
};    

    fetchMovies();
  }, [user]);

  const handleSelectMood = mood => {
    setSelectedMood(prevState => { 
      const newState = { ...prevState, [mood]: !prevState[mood] };
      //Additional logic for when a mood is selected
      //Eg. fetch movies based on the new mood
      //fetchMoviesBasedOnMood(newState);
      return newState;
    });
  };

  const renderMovieItem = ({ item, index }) => {
    //const navigation = useNavigation();
    const marginLeft = index % numColumns !== 0 ? 15 : 0;
    const movieItemStyle = [styles.movieItem, { marginLeft }];

    // Check if the movie is included in the selectedForWheel
    const isMovieSelected = selectedForWheel.some((selectedMovie) => selectedMovie.id === item.id);

    const movieImageStyle = {
      ...styles.movieImage,
      height: (windowWidth / numColumns) * 1.5, // Dynamically calculate the height
    };

    const handleAddToWheel = (movie) => {
      setSelectedForWheel((currentSelected) => {
        const isAlreadySelected = currentSelected.some(selectedMovie => selectedMovie.id === movie.id); 
        if (isAlreadySelected) {
          //If it's already selected, remove it from the array
          return currentSelected.filter(selectedMovie => selectedMovie.id !== movie.id);  
        } else {
          //If it's not already selected, add it to the array
          return [...currentSelected, movie];
        }
        
      });
    };

    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('MovieDetailScreen', { movie: item })}
        style={movieItemStyle}
        >
        <Image source={{ uri: item.posterPath }} style={movieImageStyle} />
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieRating}>Rating: {item.rating}</Text>
        <TouchableOpacity style={styles.addToWheel} onPress={() => handleAddToWheel(item)}>
          <Text style={styles.addToWheelText}>
            {isMovieSelected ? '✓ Added to Wheel' : 'Add to Wheel'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
      );  
    };

  return (
    <View style={styles.container}>
      {/* Error message display */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.moodsContainer}>
        {moods.map(mood => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodButton, selectedMood[mood] && styles.moodButtonSelected]}
            onPress={() => handleSelectMood(mood)}
          >
            <Text style={styles.moodButtonText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={movies}
        renderItem={(props) => renderMovieItem({ ...props, navigation })}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={String(numColumns)}
        style={styles.movieList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addToWheel: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    padding: 10,
  },

  addToWheelText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'right',
  },
  
  container: {
    flex: 1,
    paddingTop: 50, 
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
  },

  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },

  moodsContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
  },

  moodButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
  },

  moodButtonSelected: {
    backgroundColor: '#D0D0D0',
  },

  moodButtonText: {
    color: 'black',
  },

  movieList: {
    marginTop: 20,
  },

  movieItem: {
    flex: 1,
    margin: 5,
    marginLeft: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  movieImage: {
    width: '100%',
    //height: windowWidth / numColumns * 1.5, 
    resizeMode: 'cover',
  },

  movieTitle: {
    margin: 5,
    fontWeight: 'bold',
  },

  movieRating: {
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
    
});

export default MoodsMoviesScreen;