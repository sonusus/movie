import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showGraph, setShowGraph] = useState(false);
  const [editItem, setEditItem] = useState(null);
const [toastMessage, setToastMessage] = useState("");
const showToast = (message) => {
  setToastMessage(message);
  setTimeout(() => setToastMessage(""), 3000); 
};
useEffect(() => {
  const fetchFavorites = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) return; 

    try {
      const res = await fetch(
        `http://localhost:9000/api/favorites/my?userEmail=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      if (data.success) setFavorites(data.favorites);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  fetchFavorites();
}, []);



  
  const filteredList =
    filter === "All"
      ? favorites
      : favorites.filter((item) => item.status === filter.toLowerCase());

  
  const statusData = ["watching", "completed", "wishlist"].map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: favorites.filter((f) => f.status === status).length,
  }));


 const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:9000/api/favorites/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setFavorites((prev) => prev.filter((item) => item._id !== id));
      showToast("🗑️ Movie removed from favorites!"); // ✅ show popup instead of confirm
    } else {
      showToast("⚠️ Could not remove movie.");
    }
  } catch (err) {
    console.error(err);
    showToast("❌ Failed to remove movie");
  }
};


 
  const handleEditSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/favorites/${editItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editItem),
        }
      );
      const data = await res.json();
      if (data.success) {
        setFavorites((prev) =>
          prev.map((f) => (f._id === editItem._id ? editItem : f))
        );
        setEditItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">🎬 My Watch Universe</h1>

      {/* Tabs */}
      <div className="favorites-nav">
        {["All", "Watching", "Completed", "Wishlist", "Graph"].map((tab) => (
          <button
            key={tab}
            className={`nav-btn ${filter === tab ? "active" : ""}`}
            onClick={() => {
              if (tab === "Graph") setShowGraph(true);
              else {
                setFilter(tab);
                setShowGraph(false);
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      
      <div className="favorites-grid">
        {filteredList.length === 0 ? (
          <p className="empty-text">No movies found in this category.</p>
        ) : (
          filteredList.map((fav) => (
            <div key={fav._id} className="favorite-card">
              <div className="platform-tag">{fav.platform}</div>
              <h3>{fav.title}</h3>
              <p className={`status ${fav.status}`}>{fav.status}</p>
              <p className="rating">⭐ {fav.rating}/10</p>
              <p className="review">“{fav.review}”</p>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => setEditItem({ ...fav })}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(fav._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

     
      {showGraph && (
        <div className="graph-popup" onClick={() => setShowGraph(false)}>
          <div className="graph-box" onClick={(e) => e.stopPropagation()}>
            <h3>Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statusData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar dataKey="value" fill="#ff4f8b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <button className="close-btn" onClick={() => setShowGraph(false)}>
              Close
            </button>
          </div>
        </div>
      )}

     
      {editItem && (
        <div className="edit-popup" onClick={() => setEditItem(null)}>
          <div className="edit-box" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Movie</h2>

            <label>Platform</label>
            <input
              value={editItem.platform}
              onChange={(e) =>
                setEditItem({ ...editItem, platform: e.target.value })
              }
              placeholder="Netflix / Prime / Disney+"
            />

            <label>Status</label>
            <select
              value={editItem.status}
              onChange={(e) =>
                setEditItem({ ...editItem, status: e.target.value })
              }
            >
              <option value="watching">Watching</option>
              <option value="completed">Completed</option>
              <option value="wishlist">Wishlist</option>
            </select>

            <label>Rating (1–10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={editItem.rating}
              onChange={(e) =>
                setEditItem({ ...editItem, rating: e.target.value })
              }
            />

            <label>Review</label>
            <textarea
              rows="3"
              value={editItem.review}
              onChange={(e) =>
                setEditItem({ ...editItem, review: e.target.value })
              }
              placeholder="Share your thoughts..."
            />

            <div className="edit-buttons">
              <button onClick={handleEditSave}>💾 Save</button>
              <button onClick={() => setEditItem(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
       {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
     
  );
}

export default Favorites;
