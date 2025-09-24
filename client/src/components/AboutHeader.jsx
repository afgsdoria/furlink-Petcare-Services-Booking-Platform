import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/components/Header.css";

const AboutHeader = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="FurLink Logo" className="header-logo" />
        </Link>
      </div>

      <nav className="header-nav">
        <Link to="/about" className="active-link">About furlink</Link>
        <Link to="/login">Become a service provider</Link>
      </nav>

      <div className="header-right">
        <Link to="/login" className="btn-secondary">Login</Link>
        <Link to="/signup" className="btn-primary">Signup</Link>
      </div>
    </header>
  );
};

export default AboutHeader;
