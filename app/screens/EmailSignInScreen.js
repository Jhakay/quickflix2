import React, { useState } from "react";
import { 
    ActivityIndicator,
    Alert,      
    Button, 
    Image,
    KeyboardAvoidingView,
    Platform, //Detect OS platform
    StyleSheet,
    Text, 
    TextInput, 
    TouchableOpacity,
    useWindowDimensions,
    View,  
} from 'react-native';
import { signInWithEmailAndPassword} from "firebase/auth";
import {auth} from '../utils/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { commonStyles } from '../utils/commonStyles';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from 'firebase/firestore';

const EmailSignIn = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);

    //Get the window dimensions
    const window = useWindowDimensions();
    //Call getStyles() with current windows dimensions
    const styles = getStyles(window);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Handlers
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Please enter both email and password.");
            return;
        }

        try {
            setIsLoading(true);
            //Log in user with email and password using Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            //Extract UID from user Credential
            const uid = userCredential.user.uid;

            //Store user UID in AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify({uid}));

            //Check if user has completed profile setup.
            //If not, navigate to profile setup screen.
            navigation.navigate('ProfileSetupScreen', { userId: userCredential.user.uid });
            //Set up logic to navigate to dashboard after Profile Setup Screen has been done 
            setEmail('');
            setPassword(''); 
            console.log('Account found.')
        } catch (error) {
            setIsLoading(false);
            //Error Messages based on code 
            let errorMessage = "Login failed. Please try again.";
            if (error.code === 'auth/user-not-found') {
            errorMessage = "No account found with this email.";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Incorrect password, please try again.";
        }
        Alert.alert("Login Failed", errorMessage);
    } finally {
        setIsLoading(false); // Ensure loading state is reset
    }
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
                <Text>Hello Again!</Text>
                <Text style={commonStyles.headerText}>Email Sign In</Text>

                <TextInput
                    style={commonStyles.input}
                    placeholder="Email address"
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

                <TouchableOpacity style={commonStyles.button} onPress={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={commonStyles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    );
};

const getStyles = (window) => {
    const responsiveSize = (size) => window.width * size / 100

    return StyleSheet.create({
        
        backButtonContainer: {
            position: 'absolute',
            top: window.height * 0.01,
            left: 20,
            zIndex: 10, //Ensures button is above other elements
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


export default EmailSignIn;
