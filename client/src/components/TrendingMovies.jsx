import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TrendingMovies.css";

function TrendingMovies() {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const loaderRef = useRef(null);

 
  const fetchTrending = async (pageNum) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${pageNum}`
      );
      const data = await res.json();
      setContent((prev) => [...prev, ...data.results]);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchTrending(page);
  }, [page]);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  
  useEffect(() => {
    const slider = sliderRef.current;
    let direction = 1;

    const scrollInterval = setInterval(() => {
      if (slider) {
        slider.scrollLeft += direction * 1.5;

        if (
          slider.scrollLeft + slider.clientWidth >= slider.scrollWidth ||
          slider.scrollLeft <= 0
        ) {
          direction *= -1; 
        }
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, []);
  const handleLogout = () => {
    
    navigate("/"); 
  };
  return (
    <div className="trending-page">
    
      <header className="header">
        <div className="header-left">
          <h1 className="main-title">🎬 ENTERTAINMENT HUB</h1>
          <h2 className="sub-title">TRENDING TODAY</h2>
        </div>
         <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

     
      <div className="movie-slider-container">
        <div className="movie-grid" ref={sliderRef}>
  {content.map((item, index) => (
    <div
      key={`${item.id}-${index}`}
      className="movie-card"
      onClick={() => navigate(`/movie/${item.id}`)}
    >
      <img
        src={
          item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={item.title || item.name}
        className="poster"
      />
      <div className="rating-badge">
        ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
      </div>
      <div className="movie-info">
        <h3>{item.title || item.name}</h3>
        <p>{item.release_date}</p>
      </div>
    </div>
  ))}
  <div ref={loaderRef} className="observer"></div>
</div>

      </div>

     
      <nav className="bottom-nav">
        <button onClick={() => navigate("/trendingmovies")}>
          <span className="nav-icon">🔥</span>
          <span>Trending</span>
        </button>
        <button onClick={() => navigate("/movies")}>
          <span className="nav-icon">🎞️</span>
          <span>Movies</span>
        </button>
        <button onClick={() => navigate("/series")}>
          <span className="nav-icon">📺</span>
          <span>TV Series</span>
        </button>
        <button onClick={() => navigate("/favorites")}>
          <span className="nav-icon">❤️ </span>
          <span> My Favorites</span>
        </button>
      </nav>
    </div>
  );
}

export default TrendingMovies;
