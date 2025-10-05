import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./config/supabase";

import LandingPage from "./pages/auth/LandingPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/auth/Dashboard";
import AboutPage from "./pages/auth/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceSetupPage from "./pages/ServiceSetupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminChangePassword from "./pages/admin/AdminChangePassword";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen to auth state changes
  useEffect(() => {
    const currentSession = supabase.auth.getSession();
    currentSession.then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* User Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-setup"
          element={
            <ProtectedRoute session={session}>
              <ServiceSetupPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute session={session} adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-change-password"
          element={
            <ProtectedRoute session={session} adminOnly={true}>
              <AdminChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
