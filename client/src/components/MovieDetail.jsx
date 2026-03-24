import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();


  const [movie, setMovie] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [platform, setPlatform] = useState("Netflix");
  const [status, setStatus] = useState("watching");
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);
 const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };
  const API_KEY = import.meta.env.VITE_API_KEY;

 

  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id]);

 
  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:9000/api/favorites/reviews/${movie.id}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const startDrag = (e) => {
      isDown = true;
      startX = e.pageX || e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    };
    const stopDrag = () => (isDown = false);
    const onDrag = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", startDrag);
    slider.addEventListener("mouseleave", stopDrag);
    slider.addEventListener("mouseup", stopDrag);
    slider.addEventListener("mousemove", onDrag);
    slider.addEventListener("touchstart", startDrag);
    slider.addEventListener("touchend", stopDrag);
    slider.addEventListener("touchmove", onDrag);

    return () => {
      slider.removeEventListener("mousedown", startDrag);
      slider.removeEventListener("mouseleave", stopDrag);
      slider.removeEventListener("mouseup", stopDrag);
      slider.removeEventListener("mousemove", onDrag);
      slider.removeEventListener("touchstart", startDrag);
      slider.removeEventListener("touchend", stopDrag);
      slider.removeEventListener("touchmove", onDrag);
    };
  }, []);

  if (!movie) return <p>Loading...</p>;

  const trailer = movie.videos?.results?.find((vid) => vid.type === "Trailer");

 
  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return showToast("⚠️ Please login first");

    const movieData = {
      userEmail: user.email,
      movieId: movie.id,
      title: movie.title,
      platform,
      status,
      progress,
      rating,
      review,
    };

    try {
      const res = await fetch("http://localhost:9000/api/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      const data = await res.json();
      if (data.success) {
        setShowPopup(false);
        showToast("✅ Movie added to favorites!");
      } else {
        showToast("⚠️ Movie already in favorites!");
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to add favorite");
    }
  };

 

 

  return (
    <div className="movie-detail-container">
     
      <div className="poster-section">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </div>

   
      <div className="info-section">
        <h1>{movie.title}</h1>
        <p className="year">({movie.release_date?.slice(0, 4)})</p>
        <div className="overview">{movie.overview}</div>

        <h3>Cast</h3>
        <div className="cast-list" ref={scrollRef}>
          {movie.credits?.cast?.slice(0, 6).map((actor) => (
            <div key={actor.id} className="actor-card">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={actor.name}
              />
              <p>{actor.name}</p>
            </div>
          ))}
        </div>

        <div className="buttons">
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-btn"
            >
              ▶ Watch Trailer
            </a>
          )}
          <button className="fav-btn" onClick={() => setShowPopup(true)}>
            ❤️ Add to Favorites
          </button>
          <button
            className="review-btn"
            onClick={() => {
              fetchReviews();
              setShowReviews(true);
            }}
          >
            💬 View Reviews
          </button>
        </div>
      </div>

     
     
{showPopup && (
  <div
    className="popup-overlay"
    onClick={() => {
      showToast("❌ Action canceled"); 
      setShowPopup(false); 
    }}
  >
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <h2>Add to Favorites</h2>

      <label>
        Platform:
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>Netflix</option>
          <option>Prime Video</option>
          <option>Disney+</option>
          <option>Hotstar</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="wishlist">Wishlist</option>
        </select>
      </label>

      <label>
        Progress (episodes watched):
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          min="0"
        />
      </label>

      <label>
        Rating (1–10):
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="10"
        />
      </label>

      <label>
        Review:
        <textarea
          rows="3"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts..."
        />
      </label>

      <div className="popup-buttons">
        <button onClick={handleSave}>💾 Save</button>
        <button
          onClick={() => {
            showToast("❌ Action canceled");
            setShowPopup(false);
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}


      
      {showReviews && (
        <div className="popup-overlay" onClick={() => setShowReviews(false)}>
          <div className="popup-content reviews-popup" onClick={(e) => e.stopPropagation()}>
            <h2>🎬 Community Reviews</h2>

            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet for this movie.</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="review-card">
                    <p className="review-user">
                      👤 {rev.userEmail.replace(/(.{3}).+(@.+)/, "$1***$2")}
                    </p>
                    <p className="review-platform">Platform: {rev.platform}</p>
                    <p className="review-status">Status: {rev.status}</p>
                    <p className="review-rating">⭐ {rev.rating}/10</p>
                    <p className="review-text">“{rev.review}”</p>
                  </div>
                ))}
              </div>
            )}

            <button className="close-btn" onClick={() => setShowReviews(false)}>
              Close
            </button>
          </div>
        </div>
      )}

   
      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
}

export default MovieDetail;
