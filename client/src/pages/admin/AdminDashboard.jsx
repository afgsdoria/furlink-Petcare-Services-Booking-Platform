// src/pages/admin/AdminDashboard.jsx
import React from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin! 🎉</p>
        <p>Here you’ll manage service providers, users, and approvals.</p>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
