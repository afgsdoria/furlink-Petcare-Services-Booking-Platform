// src/components/LoggedInNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../config/supabase";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import "../styles/components/LoggedInNavbar.css";

const LoggedInNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserName(
          data.user.user_metadata?.display_name ||
            `${data.user.email?.split("@")[0]}`
        );
      }
    };
    fetchUser();
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="loggedin-header">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="header-left">
          <Link to="/dashboard">
            <img src={logo} alt="Furlink Logo" className="header-logo" />
          </Link>
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* Show "Become a Service Provider" only if NOT on ServiceSetupPage */}
          {location.pathname !== "/service-setup" && (
            <button
              className="provider-btn"
              onClick={() => navigate("/service-setup")}
            >
              Become a Service Provider
            </button>
          )}

          {/* Notifications */}
          <button className="icon-btn">
            <FaBell className="icon" />
          </button>

          {/* Account dropdown */}
          <div className="account-menu" ref={dropdownRef}>
            <button
              className="icon-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle className="icon" />
            </button>
            {dropdownOpen && (
              <div className="dropdown">
                <p className="user-name">Hi, {userName || "User"}!</p>
                <button className="logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="logout-icon" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedInNavbar;
