import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../config/supabase";

const PUBLIC_ROUTES = ["/", "/about", "/login", "/signup"];

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // also confirm profile exists
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>Checking authentication...</p>;

  // If current route is public, just render it
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return children;
  }

  // Otherwise, enforce authentication
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
