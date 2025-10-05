// src/components/LoggedInNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../config/supabase";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";
import "../styles/components/LoggedInNavbar.css";

const LoggedInNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user and initial notifications
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setUserName(
          data.user.user_metadata?.display_name ||
            `${data.user.email?.split("@")[0]}`
        );
        fetchNotifications(data.user.id);
      }
    };
    fetchUser();
  }, []);

  // Fetch notifications
  const fetchNotifications = async (userId) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!error) setNotifications(data || []);
  };

  // Realtime notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark as read
  const markAsRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

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
          <div className="notification-wrapper" ref={notifRef}>
            <button
              className="icon-btn"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <FaBell className="icon" />
              {notifications.some((n) => !n.is_read) && (
                <span className="notif-dot"></span>
              )}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                {notifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif-item ${
                        notif.is_read ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <strong>{notif.title}</strong>
                      <p>{notif.message}</p>
                      <small>
                        {new Date(notif.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

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
