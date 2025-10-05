import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

export default function AdminProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  // 🔔 Send notification helper
  const sendNotification = async (recipientId, providerId, title, message, type) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").insert([
      {
        recipient_id: recipientId,
        sender_id: user.id,
        provider_id: providerId,
        title,
        message,
        type,
      },
    ]);
  };

  useEffect(() => {
    const fetchProviderDetails = async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select(
          `*, 
          service_provider_images(image_url),
          service_provider_permits(file_url),
          service_provider_payments(file_url, method_type),
          service_provider_hours(day_of_week, start_time, end_time),
          services(name, description, notes, service_options(*))`
        )
        .eq("id", id)
        .single();

      if (!error) setProvider(data);
      setLoading(false);
    };

    fetchProviderDetails();
  }, [id]);

  const handleAction = async (status, actionTitle, actionMessage, actionType) => {
    if (["rejected", "suspended"].includes(status) && !reason.trim()) {
      alert("Please provide a reason.");
      return;
    }

    const { error } = await supabase
      .from("service_providers")
      .update({ status })
      .eq("id", id);

    if (!error) {
      await sendNotification(
        provider.user_id,
        id,
        actionTitle,
        actionMessage + (reason ? ` Reason: ${reason}` : ""),
        actionType
      );
      alert(`Provider ${status} successfully.`);
      navigate("/admin-dashboard");
    }
  };

  if (loading) return <div>Loading provider details...</div>;
  if (!provider) return <div>Provider not found.</div>;

  return (
    <div className="admin-provider-details">
      <button onClick={() => navigate("/admin-dashboard")} className="btn-back">← Back</button>
      <h2>{provider.business_name}</h2>
      <p><strong>Email:</strong> {provider.business_email}</p>
      <p><strong>Mobile:</strong> {provider.business_mobile}</p>
      <p><strong>Status:</strong> {provider.status}</p>
      <p><strong>Service Type:</strong> {provider.type_of_service}</p>
      <p><strong>Address:</strong> {provider.house_street}, {provider.barangay}, {provider.city}, {provider.province}, {provider.postal_code}</p>
      <p><strong>Social Media:</strong> {provider.social_media_url || "None"}</p>

      <h3>Facility Images</h3>
      <div className="image-grid">
        {provider.service_provider_images?.length > 0 ? (
          provider.service_provider_images.map((img, i) => (
            <img key={i} src={img.image_url} alt={`Facility ${i}`} width="150" />
          ))
        ) : (
          <p>No images uploaded.</p>
        )}
      </div>

      <h3>Permits</h3>
      {provider.service_provider_permits?.length > 0 ? (
        provider.service_provider_permits.map((p, i) => (
          <a key={i} href={p.file_url} target="_blank" rel="noopener noreferrer">
            View Permit {i + 1}
          </a>
        ))
      ) : (
        <p>No permits uploaded.</p>
      )}

      <h3>Payment Channels</h3>
      <div className="image-grid">
        {provider.service_provider_payments?.length > 0 ? (
          provider.service_provider_payments.map((pay, i) => (
            <img key={i} src={pay.file_url} alt={`Payment ${i}`} width="150" />
          ))
        ) : (
          <p>No payment channels uploaded.</p>
        )}
      </div>

      <h3>Services</h3>
      {provider.services?.map((s, i) => (
        <div key={i} className="service-card">
          <strong>{s.name}</strong>
          <p>{s.description}</p>
          <p>{s.notes}</p>
          <ul>
            {s.service_options?.map((opt, j) => (
              <li key={j}>
                {opt.pet_type} - {opt.size} ({opt.weight_range}) : ₱{opt.price}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {["pending"].includes(provider.status) && (
        <>
          <button onClick={() => handleAction("approved", "Application Approved", "Your service provider application has been approved.", "approval")} className="btn-approve">Approve</button>
          <button onClick={() => handleAction("rejected", "Application Rejected", "Your service provider application has been rejected.", "rejection")} className="btn-reject">Reject</button>
          <textarea
            placeholder="Enter rejection reason (if any)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </>
      )}

      {["approved"].includes(provider.status) && (
        <>
          <button onClick={() => handleAction("suspended", "Account Suspended", "Your provider account has been suspended.", "suspension")} className="btn-suspend">Suspend</button>
          <textarea
            placeholder="Enter suspension reason (if any)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </>
      )}

      {["suspended"].includes(provider.status) && (
        <button onClick={() => handleAction("approved", "Account Reactivated", "Your provider account has been reactivated.", "reactivation")} className="btn-reactivate">
          Reactivate
        </button>
      )}
    </div>
  );
}
