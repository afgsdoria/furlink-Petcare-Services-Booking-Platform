import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/components/Header.css";

const LoginHeader = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="FurLink Logo" className="header-logo" />
        </Link>
      </div>

      <nav className="header-nav">
        <Link to="/about">About furlink</Link>
      </nav>

      <div className="header-right">
        <Link to="/signup" className="btn-primary">Signup</Link>
      </div>
    </header>
  );
};

export default LoginHeader;
