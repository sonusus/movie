import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(""); 
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const genres = [
    "All",
    "Action",
    "Comedy",
    "Romance",
    "Horror",
    "Drama",
    "Mystery",
    "Thriller",
    "Fantasy",
    "Science Fiction",
  ];

 
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000); 
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = "";

        if (searchQuery.trim() !== "") {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
            searchQuery
          )}&page=1&include_adult=false`;
        } else if (selectedGenre === "All") {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${getGenreId(
            selectedGenre
          )}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const filteredMovies = data.results?.filter(
          (movie) =>
            movie.media_type !== "tv" &&
            movie.title &&
            !movie.title.toLowerCase().includes("wwe") &&
            !movie.title.toLowerCase().includes("post-show") &&
            movie.poster_path
        );

        setMovies(filteredMovies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        showToast("⚠️ Failed to fetch movies"); 
      }
    };

    fetchMovies();
  }, [selectedGenre, searchQuery]);

  const getGenreId = (genre) => {
    const genreMap = {
      Action: 28,
      Comedy: 35,
      Romance: 10749,
      Horror: 27,
      Drama: 18,
      Mystery: 9648,
      Thriller: 53,
      Fantasy: 14,
      "Science Fiction": 878,
    };
    return genreMap[genre];
  };

  return (
    <div className="movies-page">
      <header className="movies-header">
        <h2>🎬 Movies</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies or directors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="genre-buttons">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => {
                setSelectedGenre(genre);
                setSearchQuery(""); 
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </header>

      <div className="content-wrapper">
        <div className="movie-grid-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={`${movie.id}-${movie.title}`}
                className="movie-card"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.release_date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No movies found 😢</p>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/trendingmovies")}>🔥 Trending</button>
        <button onClick={() => navigate("/movies")}>🎞️ Movies</button>
        <button onClick={() => navigate("/series")}>📺 TV Series</button>
        <button onClick={() => navigate("/favorites")}>❤️My Favorite</button>
      </nav>

     
      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
}

export default Movies;
