import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const { data: sessionData } = await supabase
          .from("user_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setProfile(profileData);
        setSessions(sessionData || []);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        <h1>
          Welcome back, {profile?.display_name || profile?.first_name || "Pet Lover"} 👋
        </h1>

        <h2>Your Active Sessions</h2>
        <ul>
          {sessions.map((s) => (
            <li key={s.id}>
              Logged in at {new Date(s.created_at).toLocaleString()} — {s.user_agent}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
