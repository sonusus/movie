const express = require("express");
const favoriteRouter = express.Router();
const Favorite = require("../models/Favorite");
const { addFavorite, getFavoritesByEmail, updateFavorite, deleteFavorite , getReviewsByMovieId,} = require("../control/favoriteController");



favoriteRouter.post("/add", addFavorite);
favoriteRouter.get("/my", getFavoritesByEmail); 
favoriteRouter.put("/:id", updateFavorite);
favoriteRouter.delete("/:id", deleteFavorite);
favoriteRouter.get("/reviews/:movieId", getReviewsByMovieId);
module.exports =favoriteRouter;
