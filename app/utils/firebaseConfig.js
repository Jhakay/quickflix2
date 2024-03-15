import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
//import {getAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

//Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlYtqf2phH6OjvnxXJXLmHUvsCXWPSSwI",
    authDomain: "quickflix-6636a.firebaseapp.com",
    projectId: "quickflix-6636a",
    storageBucket: "quickflix-6636a.appspot.com",
    messagingSenderId: "720148394890",
    appId: "1:720148394890:web:2dd0ab857ece7643b68e73",
    measurementId: "G-8ZLM1W8ZT2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth };