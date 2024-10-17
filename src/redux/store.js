// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movies',
  initialState: [],
  reducers: {
    addMovie: (state, action) => {
      state.push(action.payload);
    },
    removeMovie: (state, action) => {
      return state.filter(movie => movie.imdbID !== action.payload);
    },
    updateMovie: (state, action) => {
      const movieIndex = state.findIndex(movie => movie.imdbID === action.payload.imdbID);
      if (movieIndex !== -1) {
        state[movieIndex] = action.payload;
      }
    }
  }
});

export const { addMovie, removeMovie, updateMovie } = movieSlice.actions;

const store = configureStore({
  reducer: {
    movies: movieSlice.reducer,
  },
});

export default store;
