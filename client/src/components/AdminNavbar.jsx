// src/components/AdminNavbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { supabase } from "../config/supabase";
import "../styles/AdminNavbar.css";

export default function AdminNavbar({ onNotificationClick }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("service_providers")
      .select("id, business_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5); // show only 5 recent

    if (!error && data) {
      // store read status locally
      const storedRead = JSON.parse(localStorage.getItem("readNotifs") || "[]");
      const formatted = data.map((item) => ({
        id: item.id,
        message: `${item.business_name} — ${item.status.toUpperCase()}`,
        created_at: new Date(item.created_at).toLocaleString(),
        read: storedRead.includes(item.id),
      }));
      setNotifications(formatted);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(
      "readNotifs",
      JSON.stringify(updated.filter((n) => n.read).map((n) => n.id))
    );
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
    setShowDropdown(false);
    onNotificationClick?.(id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left" onClick={() => navigate("/admin-dashboard")}>
        <h2 className="admin-logo">🐾 FurLink Admin</h2>
      </div>

      <div className="admin-navbar-right">
        <div className="relative">
          <button
            className="admin-notif-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell size={20} />
            {notifications.some((n) => !n.read) && (
              <span className="admin-notif-count">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="notif-dropdown">
              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? "read" : "unread"}`}
                    onClick={() => handleNotificationClick(n.id)}
                  >
                    <p>{n.message}</p>
                    <small>{n.created_at}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          className="admin-nav-btn"
          onClick={() => navigate("/admin-change-password")}
        >
          Change Password
        </button>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
