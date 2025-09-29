import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/auth/LandingPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/auth/Dashboard";
import AboutPage from "./pages/auth/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceSetupPage from "./pages/ServiceSetupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ Protected Routes */}
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

        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
