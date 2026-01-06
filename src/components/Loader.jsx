// components/Loader.jsx
import React from "react";
import "./loader.css";
import logo from "../assets/images/category/Logo2.png";

const Loader = () => {
  return (
    <div className="logo-loader">
      <img src={logo} alt="Logo" className="logo-static" />

      {/* Loader dots */}
      <div className="dot-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;
