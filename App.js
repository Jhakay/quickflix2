import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//Screens
import LaunchScreen from './app/screens/LaunchScreen';
import EmailSignUpScreen from './app/screens/EmailSignUpScreen';
import EmailSignIn from './app/screens/EmailSignInScreen';
import DashboardScreen from './app/screens/DashboardScreen';
import ProfileSetupScreen from './app/screens/ProfileSetUpScreen';
import MovieProfilerScreen from './app/screens/MovieProfilerScreen';
import AddFriendsScreen from './app/screens/AddFriendsScreen';

//Modal
import MovieDetailScreen from './app/screens/MovieDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LaunchScreen">
        <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
        <Stack.Screen name="EmailSignUpScreen" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignIn} /> 
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="ProfileSetupScreen" component={ProfileSetupScreen} />
        <Stack.Screen name="MovieProfilerScreen" component={MovieProfilerScreen} />
        <Stack.Screen name="AddFriendsScreen" component={AddFriendsScreen} />
        <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}