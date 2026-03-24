const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  platform: { type: String, default: "Netflix" },
  status: { type: String, enum: ["watching", "completed", "wishlist"], default: "watching" },
  progress: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  review: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
