import React from "react";
import "./Header.css";
import logo from "../logo.svg";

const Header = () => (
  <header className="header">
    <div className="header-content">
      <div className="header-logo">
        <img src={logo} alt="Logo" className="logo-img" />
        <span className="logo-text">
          mathon<span style={{ color: "#2196F3" }}>go</span>
        </span>
      </div>
      <nav className="header-nav">
        <a href="#">Home</a>
        <a href="#">Courses</a>
        <a href="#">Test Series</a>
        <a href="#">Contact Us</a>
      </nav>
    </div>
  </header>
);

export default Header; 