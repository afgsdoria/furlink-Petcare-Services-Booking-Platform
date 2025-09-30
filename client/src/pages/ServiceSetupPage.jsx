// src/pages/ServiceSetupPage.jsx
import React, { useState } from "react";
import { supabase } from "../config/supabase";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

const ServiceSetupPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessMobile: "",
    houseStreet: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
    typeOfService: "Pet Grooming Service",
    waiver: null,
    permits: [],
    payments: [],
    staff: [],
    hours: [],
    services: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field, multiple = false) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [field]: multiple ? [...prev[field], ...files] : files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");

      // 1. Insert into service_providers
      const { data: provider, error: providerError } = await supabase
        .from("service_providers")
        .insert([
          {
            user_id: user.id,
            business_name: formData.businessName,
            business_email: formData.businessEmail,
            business_mobile: formData.businessMobile,
            house_street: formData.houseStreet,
            barangay: formData.barangay,
            city: formData.city,
            province: formData.province,
            postal_code: formData.postalCode,
            country: formData.country,
            type_of_service: formData.typeOfService,
          }
        ])
        .select()
        .single();

      if (providerError) throw providerError;

      const providerId = provider.id;

      // 2. Insert staff
      if (formData.staff.length > 0) {
        const staffRows = formData.staff.map((s) => ({
          provider_id: providerId,
          full_name: s.fullName,
          job_title: s.jobTitle,
        }));
        await supabase.from("service_provider_staff").insert(staffRows);
      }

      // 3. Insert operating hours
      if (formData.hours.length > 0) {
        const hourRows = formData.hours.map((h) => ({
          provider_id: providerId,
          day_of_week: h.day,
          start_time: h.start,
          end_time: h.end,
        }));
        await supabase.from("service_provider_hours").insert(hourRows);
      }

      // 4. Insert services + options
      for (const service of formData.services) {
        const { data: insertedService, error: serviceError } = await supabase
          .from("services")
          .insert([
            {
              provider_id: providerId,
              type: service.type,
              name: service.name,
              description: service.description,
              notes: service.notes,
            }
          ])
          .select()
          .single();

        if (serviceError) throw serviceError;

        if (service.options?.length > 0) {
          const optionRows = service.options.map((opt) => ({
            service_id: insertedService.id,
            pet_type: opt.petType,
            size: opt.size,
            weight_range: opt.weightRange,
            price: opt.price,
          }));
          await supabase.from("service_options").insert(optionRows);
        }
      }

      setMessage("Application submitted successfully and pending approval!");
    } catch (err) {
      console.error("Error submitting application:", err.message);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoggedInNavbar />
      <div className="setup-container">
        <h2>Become a Service Provider</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Business Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>
          {/* Add other inputs here (business email, mobile, address, etc.) */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSetupPage;
