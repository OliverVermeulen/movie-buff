//  Packages
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import MovieList from "./components/MovieList";
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourites from "./components/AddFavourites";
import RemoveFavourites from "./components/RemoveFavourites";

function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Get movies from API based on search input
  const getMovieRequest = async () => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=6993a6e4`;
    const response = await fetch(url);
    const responseJson = await response.json();
    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );
    setFavourites(movieFavourites);
  }, []);

  // Save Favourites to local storage
  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  // Add movie to Favourites
  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    const set = new Set();
    const uniqueItems = [];
    for (const item of newFavouriteList) {
      if (set.has(item.imdbID)) {
        continue;
      }
      set.add(item.imdbID);
      uniqueItems.push(item);
    }
    setFavourites(uniqueItems);
    saveToLocalStorage(uniqueItems);
  };

  // Remove movie from Favourites
  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };
  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo-1">Movie</div>
        <div className="logo-2">Buff</div>
      </header>

      <div className="container-fluid movie-app">
        {/* Movies Heading and Search box */}
        <div className="row d-flex align-items-center mt-3 mb-3">
          <MovieListHeading heading="Movies" />
          <SearchBox
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        {/* Movie List */}
        <div className="row">
          <MovieList
            movies={movies}
            handleFavouritesClick={addFavouriteMovie}
            favouriteComponent={AddFavourites}
          />
        </div>

        {/* Favourites Heading */}
        <div className="row d-flex align-items-center mt-3 mb-3">
          <MovieListHeading heading="Favourites" />
        </div>

        {/* Favourites List */}
        <div className="row">
          <MovieList
            movies={favourites}
            handleFavouritesClick={removeFavouriteMovie}
            favouriteComponent={RemoveFavourites}
          />
        </div>
      </div>
    </>
  );
}

export default App;
