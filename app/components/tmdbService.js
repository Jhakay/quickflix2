import { API_KEY } from '../../config.js';

export const fetchMoreDetails = async (movieId) => {
    const apiKey = API_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    try {
      const response = await fetch(url);
      const movieDetails = await response.json();
      return movieDetails;
    } catch (error) {
      console.error('Error fetching additional movie details:', error);
      return null;
    }
  };

  