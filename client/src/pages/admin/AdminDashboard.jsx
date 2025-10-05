import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      else setProviders(data || []);
      setLoading(false);
    };
    fetchProviders();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/provider/${id}`); // ✅ correct parameter name
  };

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from("service_providers")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) console.error(error);
    else alert("Provider approved successfully!");
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    const { error } = await supabase
      .from("service_providers")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", id);
    if (error) console.error(error);
    else alert("Provider rejected.");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <AdminNavbar />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {providers.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="provider-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>{provider.business_name}</td>
                  <td>{provider.business_email}</td>
                  <td>{provider.status}</td>
                  <td>
                    <button
                      className="btn-outline"
                      onClick={() => handleViewDetails(provider.id)}
                    >
                      View Details
                    </button>

                    {provider.status === "pending" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(provider.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(provider.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
