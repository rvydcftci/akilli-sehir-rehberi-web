import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash"; // Splash ekranını unutma
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Assistant from "./pages/Assistant"; // Dosya konumuna göre yol doğruysa


function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar tüm sayfalarda görünür */}
      <Routes>
        {/* Açılışta Splash ekranı */}
        <Route path="/" element={<Splash />} />

        {/* Giriş ve kayıt ekranları */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ana sayfa */}
        <Route path="/home" element={<Home />} />

        {/* Mekanlar */}
        <Route path="/places" element={<Places />} />
        <Route path="/places/:id" element={<PlaceDetail />} />

        {/* Profil */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/assistant" element={<Assistant />} />

      </Routes>
    </Router>
  );
}

export default App;

