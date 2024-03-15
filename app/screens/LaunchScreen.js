import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { commonStyles } from '../utils/commonStyles';
import { useNavigation } from '@react-navigation/native';


const LaunchScreen = () => {
    const navigation = useNavigation();

    //Get the window dimensions
    const window = useWindowDimensions();
    //Call getStyles() with current windows dimensions
    const styles = getStyles(window);

    //Handlers
    const handleFacebookPress = () => {
        console.log('Facebook Button pressed');
    };
    
    const handleInstaPress = () => {
        console.log('Instagram button pressed');
    };
    
    const handleWhatsAppPress = () => {
        console.log('WhatsApp button pressed');
    };

    return (
        <View style={styles.container}>
            <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            />
            
            <TouchableOpacity 
                style={commonStyles.button}
                onPress={() => navigation.navigate('EmailSignUpScreen')}    
            >
                <Text style={commonStyles.buttonText}>Create Account with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity  
            >
                <Text style={commonStyles.hLinkText}
                onPress={() => navigation.navigate('EmailSignIn')}
                >
                    Log In with Email</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />                
            </View>
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity onPress={handleFacebookPress}>
                    <Image
                        source={require('../assets/facebookIcon.png')}
                        style={styles.iconStyle} 
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleWhatsAppPress}>
                    <Image
                        source={require('../assets/whatsAppIcon.png')}
                        style={styles.iconStyle} 
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleInstaPress}>
                    <Image
                        source={require('../assets/instaIcon.png')}
                        style={styles.iconStyle} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

//Function that takes the window dimensions and returns the styles
const getStyles = (window) => {
    const responsiveSize = (size) => window.width * size / 100

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            paddingTop: window.height * 0.15,
            alignItems: 'center',
        },
    
        dividerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: responsiveSize(5),
            marginBottom: 24,
        },
    
        dividerLine: {
            flex: 1,
            height: 1.5,
            backgroundColor: '#D3D3D3',
        },
    
        dividerText: {
            marginHorizontal: 8,
            color: '#9095A1',
            fontSize: responsiveSize(3.6),
        },
    
        iconStyle: {
            width: responsiveSize(12), 
            height: responsiveSize(12), 
            resizeMode: 'contain', 
        },
    
        logo: {
            width: window.width * 0.7,
            height: window.height * 0.2,
            marginBottom: responsiveSize(3.5),
            resizeMode: 'contain',
        },
    
        socialButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '80%', 
            alignSelf: 'center',
            marginTop: responsiveSize(2),
        },
    
        text: {
            fontSize: responsiveSize(4),
            fontWeight: '400',
            color: '#9095A1FF',
            marginBottom: responsiveSize(5),
        },  
    });
};


export default LaunchScreen;