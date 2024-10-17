import React, { useEffect, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { addMovie, removeMovie, updateMovie } from './redux/store';



function App() {
  const [movies, setMovies] = useState([]); // For multiple movie search results
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // To search for movies
  const [variant, setVariant] = useState(null); // A/B test variant
  const apiKey = '181c980e'; // Your OMDb API Key
  const dispatch = useDispatch();
  const movieList = useSelector(state => state.movies); // Get the movie list from Redux

  // Function to fetch movies by search term (multiple results)
  const fetchMovies = (term) => {
    const url = `http://www.omdbapi.com/?s=${encodeURIComponent(term)}&apikey=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True") {
          setMovies(data.Search); // "Search" is an array of movie results
          setError(null); // Clear any previous errors
        } else {
          setMovies([]); // Clear previous movie data
          setError(`Error: ${data.Error}`);
        }
      })
      .catch(err => {
        setMovies([]);
        setError(`Error fetching data: ${err.message}`);
      });
  };

  // Fetch a default movie on component mount (A/B test example)
  useEffect(() => {
    fetchMovies('Guardians of the Galaxy');
    setVariant(Math.random() > 0.5 ? 'A' : 'B'); // Randomly choose 'A' or 'B'
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (searchTerm) {
      fetchMovies(searchTerm);
    }
  };

  // Handle adding a movie to the Redux store
  const addMovieToList = (movie) => {
    if (!movieList.some((m) => m.imdbID === movie.imdbID)) {
      dispatch(addMovie(movie));
    }
  };

  // Handle deleting a movie from Redux store
  const deleteMovie = (imdbID) => {
    dispatch(removeMovie(imdbID));
  };

  // Handle updating a movie in Redux store
  const updateMovieInList = (movie) => {
    dispatch(updateMovie(movie));
  };

  return (
    <div className="App">
      <h1>OMDb Movie Information</h1>

      {/* Search movie */}
      <input
        type="text"
        value={searchTerm}
        placeholder="Enter movie title"
        onChange={handleSearch}
      />

      {/* A/B Test: Show different buttons based on variant */}
      {variant === 'A' ? (
        <button onClick={handleSearchSubmit}>Search Movie (Version A)</button>
      ) : (
        <button onClick={handleSearchSubmit}>Find Film (Version B)</button>
      )}

      {/* Display search error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display multiple search results in a grid */}
      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div className="movie-item" key={index}>
              <h3>{movie.Title} ({movie.Year})</h3>
              {movie.Poster !== "N/A" && (
                <img src={movie.Poster} alt={movie.Title} />
              )}
              <button onClick={() => addMovieToList(movie)}>Add to List</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found. Try searching for another title.</p>
      )}

      {/* Display added movie list */}
      <h2>My Movie List</h2>
      <ul>
        {movieList.map((m, index) => (
          <li key={index}>
            {m.Title} ({m.Released})
            <button onClick={() => deleteMovie(m.imdbID)}>Delete</button>
            <button onClick={() => updateMovieInList({ ...m, Title: m.Title + " (Updated)" })}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
