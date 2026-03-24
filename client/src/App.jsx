
import React from "react";
import { Routes, Route } from "react-router-dom";

import TrendingMovies from "./components/TrendingMovies";
import MovieDetail from "./components/MovieDetail";
import Movies from "./components/movies";
import LoginForm from "./components/user/userlogin";
import RegisterForm from "./components/user/userreg";
import Favorites from "./components/Favorites";

import Series from "./components/series";
import SeriesDetail from "./components/SeriesDetail";
import "./App.css";

function App() {
  return (
   
      <Routes>
        
        <Route path="/" element={<LoginForm />} />
        <Route path="/userreg" element={<RegisterForm />} />

       
        <Route path="/trendingmovies" element={<TrendingMovies />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movies" element={<Movies />} />
          
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/series" element={<Series />} />
<Route path="/series/:id" element={<SeriesDetail />} />
      </Routes>
   
  );
}

export default App;
