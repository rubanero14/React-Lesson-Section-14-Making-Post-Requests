import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const dbUrl =
    "https://react-certification-68c63-default-rtdb.firebaseio.com/movies.json"; // Firebase needs /<db-node-name>.json in order to create a node to store the data into backend/database

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(dbUrl);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const transformedData = [];

      // const key in data means getting the iterable key value from the object
      for (const key in data) {
        transformedData.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(transformedData);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(dbUrl, {
        method: "POST", // fetch() by default sets method to GET, thus needs explictly set methods if its POST request that we are sending to backend/database
        // body is where we set the data to be transported to backend/database
        body: JSON.stringify(movie), // JSON.stringify() method is needed to convert JS object into JSON format in order to be transport ready to backend/database
        headers: {
          "Content-Type": "application/json", // Headers is the last component we set on what type of data or content we are sending to backend/database, in this is case its JSON format
        },
      });

      const data = await response.json(); // After post request is sent, backend will respond on status of receipt so we have to await the response too for POST request

      console.log(data);

      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
