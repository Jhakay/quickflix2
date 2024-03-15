import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import moodGenreMapping from '../components/moodGenreMapping';

//const numColumns = 2; //For grid layout
const windowWidth = Dimensions.get('window').width;
// Define the moods
const moods = ['Happy', 'Excited', 'Romantic', 'Inspired', 'Thrilled', 'Scared/Spooky', 'Thoughtful/Reflective', 'Adventurous', 'Nostalgic', 'Solemn', 'Surprise Me!'];

const MoodsMoviesScreen = () => {
  const [selectedMood, setSelectedMood] = useState({});
  const [movies, setMovies] = useState([]);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [numColumns, setNumColumns] = useState(2); //For grid layout

  useEffect(() => {
    const fetchMovies = async () => {
      if (!user) {
        console.log('User not logged in');
        return;
      }

      try {

        let genreIdsForSelectedMoods = [];
        Object.keys(selectedMood).forEach(mood => {
          if (selectedMood[mood]) {
            genreIdsForSelectedMoods = genreIdsForSelectedMoods.concat(moodGenreMapping[mood] || []);
          }
        });

        //Firestore query that fetches movies with genre_ids that overlap with genreIdsForSelectedMoods
        const ratingsRef = collection(firestore, 'users', user.uid, 'ratings');
        const queryConstraints = [];

        if (genreIdsForSelectedMoods.length > 0) {
          queryConstraints.push(where('genre_ids', 'array-contains-any', genreIdsForSelectedMoods));
          queryConstraints.push(where('rating', '>=', 3));
        }

        //Implement logic for 'Surprise Me' here
        if (selectedMood['Surprise Me!']) {
          // Implement logic for "Surprise Me!" here
        }

        const finalQuery = queryConstraints.length > 0
          ? query(ratingsRef, ...queryConstraints)
          : query(ratingsRef);

        const querySnapshot = await getDocs(finalQuery);

        const fetchedMovies = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          posterPath: doc.data().posterPath,
          rating: doc.data().rating,
        }))
        .slice(0, 12);
        ;
        
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching movies: ", error);
        Alert.alert("Error", "Failed to fetch movies");
      }
      };

    fetchMovies();
  }, [user, selectedMood]);

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
    const marginLeft = index % numColumns !== 0 ? 15 : 0;
    const movieItemStyle = [styles.movieItem, { marginLeft }];

    const movieImageStyle = {
      ...styles.movieImage,
      height: (windowWidth / numColumns) * 1.5, // Dynamically calculate the height
    };

    return (
      <View style={movieItemStyle}>
        <Image source={{ uri: item.posterPath }} style={movieImageStyle} />
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieRating}>Rating: {item.rating}</Text>
      </View>
    );  
    };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodsContainer}>
        {moods.map(mood => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodButton, selectedMood[mood] && styles.moodButtonSelected]}
            onPress={() => handleSelectMood(mood)}
          >
            <Text style={styles.moodButtonText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={String(numColumns)}
        style={styles.movieList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  moodsContainer: {
    flexDirection: 'row',
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
