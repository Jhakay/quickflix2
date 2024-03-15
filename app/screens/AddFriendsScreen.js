import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Button } from 'react-native';

const AddFriendsScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
            //Implement search functionality here
            //Update searchResults with results from backend
    };

    const sendFriendRequest = (userId) => {
        // Implement friend request functionality
        //Maybe send request to backend to add a friend
    };

    return (
        <View style={styles.container}>
        <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search friends..."
        />
        <Button title="Search" onPress={handleSearch} />

        <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.friendItem}>
                <Text>{item.name}</Text>
                <TouchableOpacity onPress={() => sendFriendRequest(item.id)}>
                <Text>Add</Text>
                </TouchableOpacity>
            </View>
            )}
        />
        </View>

    );
 };


 const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
    },
    friendItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
    },
    // ... other styles
  });

export default AddFriendsScreen;