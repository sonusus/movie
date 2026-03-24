const Favorite = require("../models/Favorite");


exports.addFavorite = async (req, res) => {
  try {
    const { userEmail, movieId, title, platform, status, progress, rating, review } = req.body;

    const existing = await Favorite.findOne({ userEmail, movieId });
    if (existing) return res.status(400).json({ success: false, message: "Already in favorites" });

    const newFav = new Favorite({ userEmail, movieId, title, platform, status, progress, rating, review });
    await newFav.save();

    res.status(201).json({ success: true, message: "Added to favorites!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


exports.getFavoritesByEmail = async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail)
      return res.status(400).json({ success: false, message: "User email required" });

    
    const favorites = await Favorite.find({ userEmail });
    res.status(200).json({ success: true, favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};



exports.updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Favorite.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getReviewsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ success: false, message: "movieId is required" });
    }

   
    const reviews = await Favorite.find(
      { movieId, review: { $exists: true, $ne: "" } },
      "userEmail platform rating review status" 
    );

    if (!reviews.length) {
      return res.status(200).json({ success: true, message: "No reviews yet.", reviews: [] });
    }

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
