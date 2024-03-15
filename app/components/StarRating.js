import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const StarRating = ({ rating, onRatingPress}) => {
    const totalStars = 5;
  
    const renderStars = () => {
      let stars = [];
      for (let i = 1; i <= totalStars; i++) {
        stars.push(
          <TouchableOpacity key={i} onPress={() => onRatingPress(i)}>
            <Image
                source={i <= rating ? require('../assets/filledStar.png') : require('../assets/emptyStar.png')}
                style={{ width: 25, height: 25 }}
              />
          </TouchableOpacity>
        );
      }
      return stars;
    };
    return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
  };

  export default StarRating;