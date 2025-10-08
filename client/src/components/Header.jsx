import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/components/Header.css";
import Logo from "../assets/logo.png";

const Header = () => {
  const location = useLocation();

  // Helper: get current path
  const currentPath = location.pathname;

  return (
    <div className="header-wrapper">
      <header className="header">
        {/* Left: Logo */}
        <div className="header-left">
          <Link to="/">
            <img src={Logo} alt="FurLink Logo" className="header-logo" />
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav className="header-right">
          {/* Show 'About furlink' only if not already on About page */}
          {currentPath !== "/about" && (
            <Link to="/about" className="nav-link">
              About furlink
            </Link>
          )}

          {/* Show 'Become a Service Provider' only if not on Login page */}
          {currentPath !== "/login" && (
            <Link to="/login" className="nav-link">
              Become a Service Provider
            </Link>
          )}

          {/* Show 'Signup' only if not on Signup page */}
          {currentPath !== "/signup" && (
            <Link to="/signup" className="btn-signup">
              Signup
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;
