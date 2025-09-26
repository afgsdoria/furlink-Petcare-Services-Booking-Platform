// src/components/LoggedInNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png"; // adjust if your logo path is different
import "../styles/components/LoggedInNavbar.css";

const LoggedInNavbar = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // fetch user profile display name
  useEffect(() => {
    const fetchName = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Prefer profiles table (more reliable)
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("display_name, first_name, last_name")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && profile) {
          setUserName(profile.display_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim());
          return;
        }

        // fallback to metadata or email
        setUserName(user.user_metadata?.display_name || user.email);
      } catch (err) {
        console.error("Failed to fetch user name", err);
      }
    };

    fetchName();
  }, []);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // optional external handler
    if (onLogout) onLogout();

    await supabase.auth.signOut();
    // redirect to landing page after logout
    navigate("/");
  };

  return (
    <header className="loggedin-header">
      <div className="navbar-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Furlink logo" className="header-logo" />
          </Link>
        </div>

        <div className="nav-right">
          <button className="provider-btn" onClick={() => navigate("/service-request")}>
            Become a Service Provider
          </button>

          <button className="icon-btn" aria-label="Notifications">
            <FaBell className="icon" />
          </button>

          <div className="account-menu" ref={dropdownRef}>
            <button
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((s) => !s)}
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
