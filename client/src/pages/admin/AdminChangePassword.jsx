// src/pages/admin/AdminChangePassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import Footer from "../../components/Footer";

const AdminChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/)) {
      setError(
        "Password must be 8–12 chars, include upper & lower case letters, numbers, and special characters."
      );
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      // Update must_change_password in profiles
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("profiles")
          .update({ must_change_password: false })
          .eq("id", user.id);
      }

      navigate("/admin-dashboard");
    } catch (err) {
      setError("Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h2>Change Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default AdminChangePassword;
