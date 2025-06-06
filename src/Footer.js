import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-logo">
      <div className="logo-icon">
        {/* Replace with your logo image if available */}
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect width="40" height="40" rx="8" fill="#2196F3" />
          <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="24" fontFamily="Arial" dy=".3em">M</text>
        </svg>
      </div>
      <span className="logo-text">
        mathon<span style={{ color: "#2196F3" }}>go</span>
      </span>
    </div>
    <div className="footer-tagline">#MathBoleTohMathonGo</div>
    <div className="footer-company">© Scoremarks Technologies Private Limited</div>
    <div className="footer-links">
      <a href="#">About Us</a>
      <a href="#">Contact Us</a>
      <a href="#">Shipping & Delivery Policy</a>
      <a href="#">Refund Policy</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms & Conditions</a>
    </div>
  </footer>
);

export default Footer; 