// src/components/AdminNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "../config/supabase";
import logo from "../assets/logo.png";
import "../styles/components/AdminNavbar.css";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.display_name || user.email);
      }
    };
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="admin-header">
      <div className="navbar-container">
        {/* Logo */}
        <div className="header-left">
          <img
            src={logo}
            alt="FurLink Admin Logo"
            className="header-logo"
            onClick={() => navigate("/admin-dashboard")}
          />
        </div>

        {/* Right side */}
        <div className="nav-right">
          <FaBell className="icon" />

          <div className="account-menu" ref={dropdownRef}>
            <FaUserCircle
              className="icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown">
                <p className="user-name">Hi, {userName || "Admin"}!</p>
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

export default AdminNavbar;
