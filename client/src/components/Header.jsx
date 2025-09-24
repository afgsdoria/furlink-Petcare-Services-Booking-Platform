import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/components/Header.css";
import Logo from "../assets/logo.png"; // <-- rename your uploaded logo to logo.png and put it in /src/assets

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <Link to="/">
          <img src={Logo} alt="FurLink Logo" className="header-logo" />
        </Link>
      </div>

      {/* Right: Navigation */}
      <nav className="header-right">
        <Link to="/about" className="nav-link">
          About furlink
        </Link>
        <Link to="/login" className="nav-link">
          Become a service provider
        </Link>

        {/* Only show signup if NOT already on signup page */}
        {location.pathname !== "/signup" && (
          <Link to="/signup" className="btn-signup">
            Signup
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
