import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

// import Home from "./pages/Home"; // İleride ekleyeceğiz

function App() {
  return (
    <Router>
      <Routes>
        {/* Giriş sayfası */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />


        {/* Kayıt sayfası */}
        <Route path="/register" element={<Register />} />

        {/* Ana sayfa (ileride kullanıcı ismiyle karşılanacak) */}
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
