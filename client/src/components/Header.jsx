// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/pages/LandingPage.css"; // reuse your landing styles

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect if we are currently on the signup page
  const onSignupPage = location.pathname === "/signup";

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo">
              <span className="logo-text">furlink</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <a href="/about" className="nav-link">About furlink</a>
            <button 
              onClick={() => navigate("/provider-signup")}
              className="nav-link provider-link"
            >
              Become a service provider
            </button>
            <div className="auth-buttons">
              <button 
                onClick={() => navigate("/login")}
                className="btn-secondary"
              >
                Login
              </button>
              {/* Hide signup button if already on /signup */}
              {!onSignupPage && (
                <button 
                  onClick={() => navigate("/signup")}
                  className="btn-primary"
                >
                  Signup
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/about" className="mobile-nav-link">About furlink</a>
            <button 
              onClick={() => navigate("/provider-signup")}
              className="mobile-nav-link"
            >
              Become a service provider
            </button>
            <div className="mobile-auth-buttons">
              <button 
                onClick={() => navigate("/login")}
                className="btn-secondary mobile"
              >
                Login
              </button>
              {/* Hide signup button if already on /signup */}
              {!onSignupPage && (
                <button 
                  onClick={() => navigate("/signup")}
                  className="btn-primary mobile"
                >
                  Signup
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
