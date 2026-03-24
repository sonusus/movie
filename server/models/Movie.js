const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterUrl: String,
  releaseDate: String,
  tmdbId: Number, 
  rating: Number,
  genre: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
