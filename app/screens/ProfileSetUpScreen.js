import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';
import { commonStyles } from '../utils/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const ProfileSetupScreen = ({route, navigation}) => {
  //const navigation = useNavigation();

  // Retrieve the userId from the navigation parameters
  const userId = route.params?.userId;

  //Get the window dimensions
  const window = useWindowDimensions();
  //Call getStyles() with current windows dimensions
  const styles = getStyles(window);

  //Retrieve user's first name from Firestore - to test connection to database  
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    console.log("Current userId:", userId);
    const retrieveFirstName = async () => {
      if (!userId) return; //Ensures userId is not null
        
      try {
        // Use getDoc function from Firebase JS SDK
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const splitName = userData.name.split(' ');
          if (splitName.length) {
            setFirstName(splitName[0]); //Assumes first part of name is the person's first name
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Failed to retrieve user profile:', error);
      }
    };
      
    retrieveFirstName();
    }, [userId]); //Depend on userId to re-run the effect when it changes

    const [profileCompletion, setProfileCompletion] = useState(0); 
    const [screenName, setScreenName] = useState('');
    //Variable for adding profile picture
    //Variable for adding a friend
    //Variable for completing the movie profiler

    const updateCompletion = () => {
      let completionIncrement = 0;
      //Possible logic for calculating profile completion
      if (screenName !== '') completionIncrement += 0.25;
      
      // Add other conditions for different sections here
      setProfileCompletion(completionIncrement);
    };

    // Call updateCompletion() whenever relevant state changes to recalculate profile completion
    // Example: useEffect(() => { updateCompletion(); }, [screenName, profilePicture, movieProfile, friends]);

    //Update profile completion as requirements are met (Profile picture added, Screen name, Movie profile completed, at least 1 friend added)
    const updateProfileCompletion = (value) => {
      setScreenName(value);
      let completionIncrement = 0;
      if (value !== '') completionIncrement += 0.25;
      // Activate these as they become live
      // if (profilePictureAdded) completionIncrement += 0.25;
      // if (movieProfileCompleted) completionIncrement += 0.25;
      // if (friendsAdded) completionIncrement += 0.25;
      
      setProfileCompletion(completionIncrement);
     };

    //Handler
    const handleSaveProfile = () => {
      navigation.navigate('DashboardScreen')
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={commonStyles.heading}>Create Profile</Text>
            </View>

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />              
            </View>

            <View style={styles.header}>
            <Text style={commonStyles.hLinkText}>Hello, {firstName}, let's get your account set up.</Text>
            </View>
            
            <View style={styles.progressContainer}>
                <Text style={styles.text}> Profile completion: {Math.round(profileCompletion * 100)}%</Text>
                <ProgressBar 
                  style={styles.progressBar}
                  progress={profileCompletion} 
                  color="#6200ee"
                  //Find out why the progress bar is no longer visible   
                />
            </View>

            {/* Profile Picture */}
            <View style={styles.pictureContainer}>
                <Text style={styles.pictureLabel}>Picture</Text>
                <Text style={styles.pictureLabel2}>Choose a profile picture</Text>
                <Image
                style={styles.profilePicture}
                source={require('../assets/blankAvatar.jpg')} 
                />
                {/* Placeholder for future functionality to change picture */}
            </View>

            {/* About Me Section */}
            <View style={styles.aboutContainer}>
                <Text style={styles.aboutLabel}>About me</Text>
                <TextInput 
                    style={commonStyles.input} 
                    placeholder="Screen Name - Visible to your friends."
                    value={screenName}
                    onChangeText={(value) => {
                      setScreenName(value);
                      updateCompletion();
                    }}
                />
                
                <TouchableOpacity style={styles.localButton}>
                    <Text style={styles.localButtonText}
                      onPress={() => navigation.navigate('MovieProfilerScreen')}
                    >
                      Complete Movie Profiler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.localButton}>
                    <Text style={styles.localButtonText}
                      onPress={() => navigation.navigate('AddFriendsScreen')}
                    >
                    Add Friends</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={commonStyles.button} onPress={handleSaveProfile}>
                <Text style={commonStyles.buttonText}>Save</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const getStyles = (window) => {
  const responsiveSize = (size) => window.width * size / 100

  return StyleSheet.create({
    
    aboutContainer: {
      marginBottom: responsiveSize(3),
      width: '88%'
    },

    aboutLabel: {
      fontSize: 16,   
      fontWeight: 'bold',
      marginTop: responsiveSize(3),
      marginBottom: responsiveSize(2),
      textAlign: 'left',
    },
    
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: window.height * 0.05,
        alignItems: 'center',
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: responsiveSize(1),
      marginBottom: responsiveSize(2),
    },

    dividerLine: {
      flex: 1,
      height: 1.5,
      backgroundColor: '#D3D3D3',
    },

    editProfileText: {
      fontSize: 16,
      color: '#6200ee',
      fontWeight: 'bold',
    },

    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: '6%',
      marginBottom: responsiveSize(4),
    },

    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
    },

    localButton: {
      backgroundColor: '#e0e0e0',
      padding: 15,
      borderRadius: 25,
      marginBottom: responsiveSize(3),
      width: '88%',
      alignItems: 'center',
    },

    localButtonText: {
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },

    pictureContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    
    pictureLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#6200ee',
      marginTop: responsiveSize(4),
      marginBottom: responsiveSize(1),
    },

    pictureLabel2: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#9095A1FF',
      marginBottom: responsiveSize(3),
    },

    profilePicture: {
      width: responsiveSize(20),
      height: responsiveSize(20),
      borderRadius: responsiveSize(10),
      borderWidth: 2,
      borderColor: '#6200ee',
      marginBottom: responsiveSize(3),
      overflow: 'hidden',
    },

    progressBar: {
      height: 8,
      //transform: [{ scaleY: 4 }],    
      borderRadius: 4,
      width: '100%',
      //overflow: 'hidden',    
    },

    progressContainer: {
      width: '100%',
      paddingHorizontal: '6%',
      alignItems: 'center',
      marginBottom: responsiveSize(4),
    },

    text: {
        fontSize: responsiveSize(2.5),
        //fontWeight: '',
        color: '#9095A1FF',
        marginBottom: responsiveSize(1.5),
    },
  });
};
  
export default ProfileSetupScreen;