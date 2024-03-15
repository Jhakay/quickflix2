import React from 'react';
import {Image} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


//Tabs
import FriendsScreen from '../screens/FriendsScreen';
import MoodsMoviesScreen from '../screens/MoodsMoviesScreen';
import WheelScreen from '../screens/WheelScreen';
import AccountSettings from '../screens/AccountSettingsScreen';

//Create Tabs
const Tabs = createBottomTabNavigator();
    
const DashboardScreen = () => {
    return (
        <Tabs.Navigator
        screenOptions={
            {
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'grey',
            tabBarStyle: {
                backgroundColor: '#ADD8E6',
            },
            tabBarLabelStyle: {
                fontSize: 15,
                fontWeight: 'bold',
            },
            tabBarIconStyle: {
                //to be decided
            }
        }}
        >
            <Tabs.Screen 
                name="Friends" 
                component={FriendsScreen} 
                options={{ 
                    title: 'Friends',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="people-outline" color={color} size={size} />
                    ),
                 }} 
                 />

            <Tabs.Screen
                name="Moods and Movies Screen" 
                component={MoodsMoviesScreen} 
                options={{ 
                    title: 'Moods & Movies',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="theaters" color={color} size={size} />
                    ),
                }} 
            />

            <Tabs.Screen 
                name="Wheel" 
                component={WheelScreen} 
                options={{ 
                    title: 'Wheel',
                    tabBarIcon: ({color, size}) => (
                        <Image
                            source={require('../assets/Wheel.png')}
                            resizeMode="contain"
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    ),
                }} 
            />

            <Tabs.Screen 
                name="AccountSettings" 
                component={AccountSettings} 
                options={{ 
                    title: 'Account', 
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="settings" color={color} size={size} />
                    ),
                }} 
            />

        </Tabs.Navigator>
    );
};

export default DashboardScreen;