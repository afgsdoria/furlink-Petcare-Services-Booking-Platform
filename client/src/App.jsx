import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/auth/LandingPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/auth/Dashboard";
import AboutPage from "./pages/auth/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceSetupPage from "./pages/ServiceSetupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviderDetails from "./pages/admin/AdminProviderDetails";
import AdminChangePassword from "./pages/admin/AdminChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* User routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-setup"
        element={
          <ProtectedRoute>
            <ServiceSetupPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/provider/:id"
        element={
          <ProtectedRoute>
            <AdminProviderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-change-password"
        element={
          <ProtectedRoute>
            <AdminChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
