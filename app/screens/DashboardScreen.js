import React, { useState } from 'react';
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
    const [selectedForWheel, setSelectedForWheel] = useState([]);

    return (
        <Tabs.Navigator
        screenOptions={
            {
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'grey',
            tabBarStyle: {
                backgroundColor: '#F7F2F8',
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
                options={{ 
                    title: 'Moods & Movies',
                    tabBarIcon: ({color, size}) => (
                        <MaterialIcons name="theaters" color={color} size={size} />
                    ),
                }}
                >
                    {props => <MoodsMoviesScreen {...props} selectedForWheel={selectedForWheel} setSelectedForWheel={setSelectedForWheel} />}  
            </Tabs.Screen> 

            <Tabs.Screen 
                name="Wheel" 
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
                >
                    {() => <WheelScreen selectedMovies={selectedForWheel} />}
            </Tabs.Screen> 
            
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