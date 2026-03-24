import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Movies.css";

function Series() {
  const [series, setSeries] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  const genres = [
    "All",
    "Action & Adventure",
    "Comedy",
    "Drama",
    "Mystery",
    "Sci-Fi & Fantasy",
    "Animation",
    "Crime",
    "Documentary",
    "Family",
  ];

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        let url = "";

        if (searchQuery.trim() !== "") {
         
          url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
            searchQuery
          )}&page=1&include_adult=false`;
        } else if (selectedGenre === "All") {
          url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
          url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${getGenreId(
            selectedGenre
          )}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        const filteredSeries = data.results?.filter(
          (show) =>
            show.name &&
            !show.name.toLowerCase().includes("wwe") &&
            show.poster_path
        );

        setSeries(filteredSeries || []);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, [selectedGenre, searchQuery]);

  const getGenreId = (genre) => {
    const genreMap = {
      "Action & Adventure": 10759,
      Comedy: 35,
      Drama: 18,
      Mystery: 9648,
      "Sci-Fi & Fantasy": 10765,
      Animation: 16,
      Crime: 80,
      Documentary: 99,
      Family: 10751,
    };
    return genreMap[genre];
  };

  return (
    <div className="movies-page">
      <header className="movies-header">
        <h2>📺 TV Series</h2>

      
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="genre-buttons">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${
                selectedGenre === genre ? "active" : ""
              }`}
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
          {series.length > 0 ? (
            series.map((show) => (
              <div
                key={`${show.id}-${show.name}`}
                className="movie-card"
                onClick={() => navigate(`/series/${show.id}`)}
              >
                <img
                  src={
                    show.poster_path
                      ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={show.name}
                />
                <div className="movie-info">
                  <h3>{show.name}</h3>
                  <p>
                    {show.first_air_date
                      ? show.first_air_date
                      : "Release date unknown"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No series found 😢</p>
          )}
        </div>
      </div>

      <nav className="bottom-nav">
        <button onClick={() => navigate("/trendingmovies")}>🔥 Trending</button>
        <button onClick={() => navigate("/movies")}>🎞️ Movies</button>
        <button onClick={() => navigate("/series")}>📺 TV Series</button>
        <button onClick={() => navigate("/favorites")}>❤️ My Favorite</button>
      </nav>
    </div>
  );
}

export default Series;
