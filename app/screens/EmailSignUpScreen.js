import React, { useState } from "react";
import { 
    ActivityIndicator,
    Alert,      
    Button, 
    Image,
    Platform, //Detect OS platform
    StyleSheet,
    Text, 
    TextInput, 
    TouchableOpacity,
    useWindowDimensions,
    View,  
} from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { commonStyles } from '../utils/commonStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import {auth, db} from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

const SignUpWithEmailScreen = () => {
    //Get the window dimensions
    const window = useWindowDimensions();
    //Call getStyles() with current windows dimensions

    const styles = getStyles(window);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    //Handlers
    const handleSignUp = () => {
        if (email === '' || password === '' || name === '') {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
    
        setIsLoading(true); //Start Loading
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User account created!");
            // Create a user document in Firestore
            const userRef = doc(db, "users", userCredential.user.uid);
            return setDoc(userRef, {
                name: name,
                email: email,
        });
    })
    .then(() => {
        //Executes if both createUserWithEmailAndPassword and setDoc succeed
        setIsLoading(false); //Stop loading
        //Clear input fields
        setName('');
        setEmail('');
        setPassword('');
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate('EmailSignIn');
    })
    .catch((error) => {
        setIsLoading(false); //Stop loading on error
        //Catches errors from both createUserWithEmailAndPassword and setDoc
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Error", errorMessage);
    });
};

    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            //resetScrollToCoords={{x: 0, y: 0}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64: 0}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButtonContainer}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>

                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <Text style={commonStyles.heading}>Create your account</Text>

                <TextInput
                    style={commonStyles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={commonStyles.input}
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <TextInput
                    style={commonStyles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry={true} 
                />

                <TouchableOpacity style={commonStyles.button} onPress={handleSignUp} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={commonStyles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

//Function that takes the window dimensions and returns the styles
const getStyles = (window) => {
    const responsiveSize = (size) => window.width * size / 100

    return StyleSheet.create({
    
        backButtonContainer: {
            position: 'absolute',
            top: window.height * 0.01,
            left: 20,
            zIndex: 10, //Ensure button is above other elements
        },
        
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            paddingTop: window.height * 0.15,
            alignItems: 'center',
        },
    
        logo: {
            width: window.width * 0.7,
            height: window.height * 0.2,
            marginBottom: responsiveSize(3.5),
            resizeMode: 'contain',
        },
        
    });
};


export default SignUpWithEmailScreen;
