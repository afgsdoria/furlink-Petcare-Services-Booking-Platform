import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import Header from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import "../styles/ServiceSetupPage.css";
import { supabase } from "../config/supabase";

const petSizes = ["all", "xs", "s", "m", "l", "xl", "cat"];

export function validateBusinessInfo(
  businessInfo,
  facilityImages,
  paymentChannelFiles,
  businessPermitFile,
  employees
) {
  if (!businessInfo.businessName.trim()) return false;
  if (!businessInfo.businessEmail.trim()) return false;
  if (!businessInfo.businessMobile.trim()) return false;
  if (businessInfo.operatingHours.length === 0) return false;
  for (let slot of businessInfo.operatingHours) {
    if (slot.days.length === 0 || !slot.startTime || !slot.endTime) return false;
  }
  if (!businessInfo.houseStreet.trim()) return false;
  if (!businessInfo.barangay.trim()) return false;
  if (!businessInfo.city.trim()) return false;
  if (!businessInfo.province.trim()) return false;
  if (!businessInfo.postalCode.trim()) return false;
  if (!businessInfo.typeOfService.trim()) return false;
  if (facilityImages.length === 0) return false;
  if (paymentChannelFiles.length === 0) return false;
  if (!businessPermitFile) return false;
  for (let emp of employees) {
    if (!emp.fullName.trim() || !emp.position.trim()) return false;
  }
  return true;
}

export function validateServiceInfo(services) {
  if (services.length === 0) return false;
  for (let service of services) {
    if (!service.name.trim() || !service.description.trim()) return false;
    if (service.options.length === 0) return false;
    
    for (let i = 0; i < service.options.length; i++) {
      const option = service.options[i];
      if (
        !option.petType ||
        !option.size ||
        !option.weightRange.trim() ||
        !option.price ||
        isNaN(Number(option.price))
      )
        return false;
      
      if (option.size !== "cat" && option.size !== "all") {
        if (!option.minWeight || !option.maxWeight) return false;
        if (parseFloat(option.minWeight) < 1) return false;
        if (parseFloat(option.maxWeight) <= parseFloat(option.minWeight)) return false;
      }
      
      if ((option.size !== "cat" && option.size !== "all") || (option.minWeight !== 0 && option.maxWeight !== 0)) {
        for (let j = i + 1; j < service.options.length; j++) {
          const otherOption = service.options[j];
          if (otherOption.petType !== option.petType) continue;
          if (otherOption.size === "cat" && otherOption.minWeight === 0) continue;
          if (otherOption.size === "all" && otherOption.minWeight === 0) continue;
          if (!otherOption.minWeight || !otherOption.maxWeight) continue;
          
          const currentMin = parseFloat(option.minWeight);
          const currentMax = parseFloat(option.maxWeight);
          const otherMin = parseFloat(otherOption.minWeight);
          const otherMax = parseFloat(otherOption.maxWeight);
          
          if (
            (currentMin > otherMin && currentMin < otherMax) ||
            (currentMax > otherMin && currentMax < otherMax) ||
            (currentMin < otherMin && currentMax > otherMax)
          ) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

export default function ServiceSetupPage() {
  const [step, setStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessEmail: "",
    businessMobile: "",
    socialMediaUrl: "",
    operatingHours: [{ days: [], startTime: "9:00", endTime: "17:00" }],
    houseStreet: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
    typeOfService: "Pet Grooming",
  });

  const [waiverFile, setWaiverFile] = useState(null);
  const [facilityImages, setFacilityImages] = useState([]);
  const [paymentChannelFiles, setPaymentChannelFiles] = useState([]);
  const [businessPermitFile, setBusinessPermitFile] = useState(null);
  const [employees, setEmployees] = useState([{ fullName: "", position: "" }]);
  const [services, setServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (slotIndex, day) => {
    setBusinessInfo((prev) => {
      const dayUsedInOtherSlot = prev.operatingHours.some(
        (slot, i) => i !== slotIndex && slot.days.includes(day)
      );
      if (dayUsedInOtherSlot) return prev;
      
      return {
        ...prev,
        operatingHours: prev.operatingHours.map((slot, i) =>
          i === slotIndex
            ? {
                ...slot,
                days: slot.days.includes(day)
                  ? slot.days.filter((d) => d !== day)
                  : [...slot.days, day],
              }
            : slot
        ),
      };
    });
  };

  const isDayDisabled = (slotIndex, day) => {
    return businessInfo.operatingHours.some(
      (slot, i) => i !== slotIndex && slot.days.includes(day)
    );
  };

  const getAllAssignedDays = () => {
    const assignedDays = new Set();
    businessInfo.operatingHours.forEach((slot) => {
      slot.days.forEach((day) => assignedDays.add(day));
    });
    return assignedDays;
  };

  const canAddMoreSlots = () => {
    const assignedDays = getAllAssignedDays();
    return assignedDays.size < 7;
  };

  const handleTimeChange = (slotIndex, type, value) => {
    setBusinessInfo((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((slot, i) =>
        i === slotIndex ? { ...slot, [type]: value } : slot
      ),
    }));
  };

  const addTimeSlot = () => {
    setBusinessInfo((prev) => ({
      ...prev,
      operatingHours: [...prev.operatingHours, { days: [], startTime: "9:00", endTime: "17:00" }],
    }));
  };

  const removeTimeSlot = (index) => {
    if (businessInfo.operatingHours.length > 1) {
      setBusinessInfo((prev) => ({
        ...prev,
        operatingHours: prev.operatingHours.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileSelect = (setter, e, maxSizeMB = 1, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSizeMB * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: `File size must not exceed ${maxSizeMB}MB.`,
        }));
        e.target.value = "";
        return;
      }
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
      setter(file);
    }
  };

  const handleMultiFileSelect = (setter, currentFiles, e, maxFiles, fieldName) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (currentFiles.length + files.length > maxFiles) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: `You can upload up to ${maxFiles} files.`,
        }));
        e.target.value = "";
        return;
      }
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
      setter((prev) => [...prev, ...files]);
      e.target.value = "";
    }
  };

  const removeFile = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmployeeChange = (index, field, value) => {
    setEmployees((prev) =>
      prev.map((emp, i) => (i === index ? { ...emp, [field]: value } : emp))
    );
  };

  const addEmployee = () => {
    setEmployees((prev) => [...prev, { fullName: "", position: "" }]);
  };

  const removeEmployee = (index) => {
    if (employees.length > 1) {
      setEmployees((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addService = (type) => {
    setServices((prev) => [
      ...prev,
      {
        type,
        name: "",
        description: "",
        notes: "",
        options: [{ petType: "dog", size: "xs", weightRange: "", minWeight: "", maxWeight: "", price: "" }],
      },
    ]);
  };

  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    setServices((prev) =>
      prev.map((service, i) => (i === index ? { ...service, [field]: value } : service))
    );
  };

  const addServiceOption = (serviceIndex) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === serviceIndex
          ? {
              ...service,
              options: [
                ...service.options,
                { petType: "dog", size: "xs", weightRange: "", minWeight: "", maxWeight: "", price: "" },
              ],
            }
          : service
      )
    );
  };

  const removeServiceOption = (serviceIndex, optionIndex) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === serviceIndex && service.options.length > 1
          ? {
              ...service,
              options: service.options.filter((_, j) => j !== optionIndex),
            }
          : service
      )
    );
  };

  const updateServiceOption = (serviceIndex, optionIndex, field, value) => {
    setServices((prev) =>
      prev.map((service, i) =>
        i === serviceIndex
          ? {
              ...service,
              options: service.options.map((opt, j) => {
                if (j === optionIndex) {
                  const updated = { ...opt, [field]: value };
                  
                  if (field === "weightRange") {
                    if ((opt.size === "cat" || opt.size === "all") && (value.toLowerCase().trim() === "n/a" || value.trim() === "0")) {
                      updated.minWeight = 0;
                      updated.maxWeight = 0;
                      updated.weightRange = "N/A";
                    } else {
                      const match = value.match(/(\d+\.?\d*)\s*(?:kg|kgs?)?\s*-\s*(\d+\.?\d*)\s*(?:kg|kgs?)?/i);
                      if (match) {
                        const min = parseFloat(match[1]);
                        const max = parseFloat(match[2]);
                        
                        if (min < 1) {
                          updated.minWeight = "";
                          updated.maxWeight = "";
                          setValidationErrors((prev) => ({
                            ...prev,
                            [`weight_${serviceIndex}_${optionIndex}`]: "Minimum weight must be at least 1 kg"
                          }));
                        } else if (max <= min) {
                          updated.minWeight = "";
                          updated.maxWeight = "";
                          setValidationErrors((prev) => ({
                            ...prev,
                            [`weight_${serviceIndex}_${optionIndex}`]: "Maximum weight must be greater than minimum weight"
                          }));
                        } else {
                          updated.minWeight = min;
                          updated.maxWeight = max;
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[`weight_${serviceIndex}_${optionIndex}`];
                            return newErrors;
                          });
                        }
                      } else {
                        updated.minWeight = "";
                        updated.maxWeight = "";
                      }
                    }
                  }
                  
                  return updated;
                }
                return opt;
              }),
            }
          : service
      )
    );
  };

  const isSizeDisabledForService = (serviceIndex, optionIndex, petType, size) => {
    const service = services[serviceIndex];
    if (!service) return false;
    
    return service.options.some(
      (opt, i) => i !== optionIndex && opt.petType === petType && opt.size === size
    );
  };

  const checkWeightRangeOverlap = (serviceIndex, optionIndex) => {
    const service = services[serviceIndex];
    if (!service) return null;
    
    const currentOption = service.options[optionIndex];
    if (!currentOption.minWeight || !currentOption.maxWeight || !currentOption.petType) {
      return null;
    }
    
    for (let i = 0; i < service.options.length; i++) {
      if (i === optionIndex) continue;
      
      const otherOption = service.options[i];
      if (otherOption.petType !== currentOption.petType) continue;
      if (!otherOption.minWeight || !otherOption.maxWeight) continue;
      
      const currentMin = parseFloat(currentOption.minWeight);
      const currentMax = parseFloat(currentOption.maxWeight);
      const otherMin = parseFloat(otherOption.minWeight);
      const otherMax = parseFloat(otherOption.maxWeight);
      
      if (
        (currentMin > otherMin && currentMin < otherMax) ||
        (currentMax > otherMin && currentMax < otherMax) ||
        (currentMin < otherMin && currentMax > otherMax)
      ) {
        return `Overlaps with ${otherOption.size === "all" ? "All Sizes" : otherOption.size.toUpperCase()} (${otherMin}-${otherMax} kg)`;
      }
    }
    
    return null;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (
      validateBusinessInfo(
        businessInfo,
        facilityImages,
        paymentChannelFiles,
        businessPermitFile,
        employees
      )
    ) {
      setValidationErrors({});
      setStep(2);
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        step1: "Please fill all required fields and upload required files.",
      }));
    }
  };

  const handleBack = () => {
    setValidationErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // 🔑 Get the logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // ✅ Upload helper — stores inside the user’s folder for security
      const uploadFile = async (folder, file) => {
        if (!file) return null;
        const filePath = `${user.id}/${folder}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
          .from("service_provider_uploads")
          .upload(filePath, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from("service_provider_uploads")
          .getPublicUrl(filePath);
        return publicUrlData.publicUrl;
      };

      // 📁 Upload all required files
      const waiverUrl = await uploadFile("waivers", waiverFile);
      const permitUrl = await uploadFile("permits", businessPermitFile);

      const facilityUrls = [];
      for (const file of facilityImages) {
        const url = await uploadFile("facilities", file);
        if (url) facilityUrls.push(url);
      }

      const paymentUrls = [];
      for (const file of paymentChannelFiles) {
        const url = await uploadFile("payments", file);
        if (url) paymentUrls.push(url);
      }

      // 🏢 Insert into service_providers table
      const { data: providerData, error: providerError } = await supabase
        .from("service_providers")
        .insert([
          {
            user_id: user.id,
            business_name: businessInfo.businessName,
            business_email: businessInfo.businessEmail,
            business_mobile: businessInfo.businessMobile,
            house_street: businessInfo.houseStreet,
            barangay: businessInfo.barangay,
            city: businessInfo.city,
            province: businessInfo.province,
            postal_code: businessInfo.postalCode,
            country: businessInfo.country,
            type_of_service: businessInfo.typeOfService,
            waiver_url: waiverUrl,
            social_media_url: businessInfo.socialMediaUrl,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (providerError) throw providerError;
      const providerId = providerData.id;

      // 🕒 Insert operating hours
      const hoursData = [];
      businessInfo.operatingHours.forEach((slot) => {
        slot.days.forEach((day) => {
          hoursData.push({
            provider_id: providerId,
            day_of_week: day,
            start_time: slot.startTime,
            end_time: slot.endTime,
          });
        });
      });
      if (hoursData.length > 0) {
        const { error: hoursError } = await supabase
          .from("service_provider_hours")
          .insert(hoursData);
        if (hoursError) throw hoursError;
      }

      // 🖼️ Insert facility images
      for (const url of facilityUrls) {
        await supabase.from("service_provider_images").insert({
          provider_id: providerId,
          image_url: url,
        });
      }

      // 💳 Insert payment channels
      for (const url of paymentUrls) {
        await supabase.from("service_provider_payments").insert({
          provider_id: providerId,
          method_type: "QR",
          file_url: url,
        });
      }

      // 📜 Insert permit file
      if (permitUrl) {
        await supabase.from("service_provider_permits").insert({
          provider_id: providerId,
          permit_type: "Business Permit",
          file_url: permitUrl,
        });
      }

      // 👷 Insert employees
      for (const emp of employees) {
        await supabase.from("service_provider_staff").insert({
          provider_id: providerId,
          full_name: emp.fullName,
          job_title: emp.position,
        });
      }

      // 🧴 Insert services and options
      for (const service of services) {
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .insert([
            {
              provider_id: providerId,
              type: service.type,
              name: service.name,
              description: service.description,
              notes: service.notes,
            },
          ])
          .select()
          .single();

        if (serviceError) throw serviceError;
        const serviceId = serviceData.id;

        const optionsData = service.options.map((opt) => ({
          service_id: serviceId,
          pet_type: opt.petType,
          size: opt.size,
          weight_range: opt.weightRange,
          price: parseFloat(opt.price),
        }));

        const { error: optionsError } = await supabase
          .from("service_options")
          .insert(optionsData);
        if (optionsError) throw optionsError;
      }

      // ✅ Success Modal
      setModalOpen(true);
    } catch (error) {
      console.error("❌ Submission Error:", error);
      setValidationErrors({
        step2: error.message || "Submission failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎉 Modal close handler
  const handleModalClose = () => {
    setModalOpen(false);
    window.location.href = "/dashboard";
  };


  return (
    <>
      <Header />
      <div className="service-setup-page">
        <div className="service-setup-container">
          <h1 className="page-title">Service Provider Application</h1>

          {step === 1 && (
            <form onSubmit={handleNext} className="setup-form">
              {validationErrors.step1 && (
                <div className="validation-error-message">{validationErrors.step1}</div>
              )}
              <div className="form-section">
                <h2 className="section-title">Business Information</h2>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>
                      Business Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={businessInfo.businessName}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Business Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={businessInfo.businessEmail}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Business Mobile Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="businessMobile"
                      value={businessInfo.businessMobile}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Social Media URL</label>
                  <input
                    type="url"
                    name="socialMediaUrl"
                    value={businessInfo.socialMediaUrl}
                    onChange={handleBusinessChange}
                  />
                  <small className="file-hint">Enter your Facebook, Instagram, or website link</small>
                </div>

                <div className="form-group">
                  <label>
                    Operating Hours <span className="required">*</span>
                  </label>
                  {businessInfo.operatingHours.map((slot, slotIndex) => (
                    <div key={slotIndex} className="operating-hours">
                      <div className="day-selector">
                        {daysOfWeek.map((day, i) => {
                          const isDisabled = isDayDisabled(slotIndex, dayNames[i]);
                          return (
                            <button
                              key={i}
                              type="button"
                              className={`day-btn ${
                                slot.days.includes(dayNames[i]) ? "active" : ""
                              } ${isDisabled ? "disabled" : ""}`}
                              onClick={() => toggleDay(slotIndex, dayNames[i])}
                              disabled={isDisabled}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                      <div className="time-selector">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(slotIndex, "startTime", e.target.value)}
                          className="time-input"
                          required
                        />
                        <span className="time-separator">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(slotIndex, "endTime", e.target.value)}
                          className="time-input"
                          required
                        />
                        {businessInfo.operatingHours.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(slotIndex)}
                            className="icon-btn"
                            title="Remove time slot"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addTimeSlot} 
                    className="add-timeslot-btn"
                    disabled={!canAddMoreSlots()}
                  >
                    + Add timeslot
                  </button>
                  {!canAddMoreSlots() && (
                    <small className="info-message">All days of the week are assigned to time slots</small>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Business Address</h2>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>
                      House/Street Number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="houseStreet"
                      value={businessInfo.houseStreet}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Barangay <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="barangay"
                      value={businessInfo.barangay}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      City/Municipality <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={businessInfo.city}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>
                      Province <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={businessInfo.province}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Postal Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={businessInfo.postalCode}
                      onChange={handleBusinessChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Country <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={businessInfo.country}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Business Documents</h2>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>
                      Service Type <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="typeOfService"
                      value={businessInfo.typeOfService}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Waiver</label>
                    <label className="file-upload-btn">
                      <Upload size={20} />
                      <span>Choose A File</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileSelect(setWaiverFile, e, 1, 'waiverFile')}
                        hidden
                      />
                    </label>
                    <small className="file-hint">PDF or Word file, up to 1MB</small>
                    {validationErrors.waiverFile && (
                      <small className="error-message">{validationErrors.waiverFile}</small>
                    )}
                    {waiverFile && (
                      <div className="file-item">
                        <span>{waiverFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setWaiverFile(null)}
                          className="remove-btn"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>
                      Images of Facilities <span className="required">*</span>
                    </label>
                    <label className="file-upload-btn">
                      <Upload size={20} />
                      <span>Choose A File</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleMultiFileSelect(setFacilityImages, facilityImages, e, 3, "facilityImages")
                        }
                        disabled={facilityImages.length >= 3}
                        hidden
                      />
                    </label>
                    <small className="file-hint">Up to 3 images</small>
                    {validationErrors.facilityImages && (
                      <small className="error-message">{validationErrors.facilityImages}</small>
                    )}
                    {facilityImages.length > 0 && (
                      <div className="file-list">
                        {facilityImages.map((file, i) => (
                          <div key={i} className="file-item">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(setFacilityImages, i)}
                              className="remove-btn"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>
                      Payment Channel <span className="required">*</span>
                    </label>
                    <label className="file-upload-btn">
                      <Upload size={20} />
                      <span>Choose A File</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleMultiFileSelect(setPaymentChannelFiles, paymentChannelFiles, e, 3, "paymentChannelFiles")
                        }
                        disabled={paymentChannelFiles.length >= 3}
                        hidden
                      />
                    </label>
                    <small className="file-hint">Upload only up to 3 QR Code</small>
                    {validationErrors.paymentChannelFiles && (
                      <small className="error-message">{validationErrors.paymentChannelFiles}</small>
                    )}
                    {paymentChannelFiles.length > 0 && (
                      <div className="file-list">
                        {paymentChannelFiles.map((file, i) => (
                          <div key={i} className="file-item">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(setPaymentChannelFiles, i)}
                              className="remove-btn"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Business Permit <span className="required">*</span>
                  </label>
                  <label className="file-upload-btn">
                    <Upload size={20} />
                    <span>Choose A File</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileSelect(setBusinessPermitFile, e, 1, 'businessPermitFile')}
                      hidden
                    />
                  </label>
                  <small className="file-hint">PDF or Word file, up to 1MB</small>
                  {validationErrors.businessPermitFile && (
                    <small className="error-message">{validationErrors.businessPermitFile}</small>
                  )}
                  {businessPermitFile && (
                    <div className="file-item">
                      <span>{businessPermitFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setBusinessPermitFile(null)}
                        className="remove-btn"
                      >
                        <X size={16} />
                        </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Employee/s Information</h2>
                {employees.map((emp, index) => (
                  <div key={index} className="employee-row">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>
                          Full Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          value={emp.fullName}
                          onChange={(e) => handleEmployeeChange(index, "fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Position <span className="required">*</span>
                        </label>
                        <div className="input-with-button">
                          <input
                            type="text"
                            value={emp.position}
                            onChange={(e) => handleEmployeeChange(index, "position", e.target.value)}
                            required
                          />
                          {employees.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmployee(index)}
                              className="icon-btn"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEmployee} className="add-btn">
                  + Add Employee
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="setup-form">
              {validationErrors.step2 && (
                <div className="validation-error-message">{validationErrors.step2}</div>
              )}
              <div className="form-section">
                <h2 className="section-title">Service Information</h2>

                <div className="form-group">
                  <label>What service do you want to add?</label>
                  <div className="service-type-buttons">
                    <button
                      type="button"
                      onClick={() => addService("package")}
                      className="btn-outline"
                    >
                      + Add Package
                    </button>
                    <button
                      type="button"
                      onClick={() => addService("individual")}
                      className="btn-outline"
                    >
                      + Add Individual Service
                    </button>
                  </div>
                </div>

                {services.map((service, serviceIndex) => (
                  <React.Fragment key={serviceIndex}>
                    <div className="service-card">
                      <div className="service-card-header">
                        <h3>{service.type === "package" ? "Package" : "Individual Service"}</h3>
                        <button
                          type="button"
                          onClick={() => removeService(serviceIndex)}
                          className="icon-btn"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>
                            Name <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(serviceIndex, "name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Description <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={service.description}
                            onChange={(e) =>
                              updateService(serviceIndex, "description", e.target.value)
                            }
                            placeholder="Describe your offered packages"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          value={service.notes}
                          onChange={(e) => updateService(serviceIndex, "notes", e.target.value)}
                          placeholder="Note the possible charges on the day of the appointment (e.g. +Php 100 for Medical Treatment)."
                          rows={2}
                        />
                      </div>

                      {service.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-row">
                          <div className="form-grid-4">
                            <div className="form-group">
                              <label>
                                Pet Type <span className="required">*</span>
                              </label>
                              <select
                                value={option.petType}
                                onChange={(e) =>
                                  updateServiceOption(
                                    serviceIndex,
                                    optionIndex,
                                    "petType",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="dog">Dog</option>
                                <option value="cat">Cat</option>
                                <option value="dog-cat">Dog and Cat</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>
                                Pet Size <span className="required">*</span>
                              </label>
                              <select
                                value={option.size}
                                onChange={(e) =>
                                  updateServiceOption(
                                    serviceIndex,
                                    optionIndex,
                                    "size",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                {petSizes.map((size) => {
                                  const isDisabled = isSizeDisabledForService(
                                    serviceIndex,
                                    optionIndex,
                                    option.petType,
                                    size
                                  );
                                  let label = size.toUpperCase();
                                  if (size === "all") label = "All Sizes";
                                  
                                  return (
                                    <option key={size} value={size} disabled={isDisabled}>
                                      {label}
                                      {isDisabled ? " (already used)" : ""}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="form-group">
                              <label>
                                Weight Range <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                value={option.weightRange}
                                onChange={(e) =>
                                  updateServiceOption(
                                    serviceIndex,
                                    optionIndex,
                                    "weightRange",
                                    e.target.value
                                  )
                                }
                                placeholder={option.size === "cat" || option.size === "all" ? "N/A or 1 - 5 kg" : "1 - 5 kg"}
                                required
                              />
                              {(option.size === "cat" || option.size === "all") && (
                                <small className="info-message">
                                  For {option.size === "all" ? "all sizes" : "cat size"}, you can enter "N/A" or "0"
                                </small>
                              )}
                              {option.minWeight && option.maxWeight && (
                                <small className="info-message">
                                  Range: {option.minWeight} kg to {option.maxWeight} kg
                                </small>
                              )}
                              {validationErrors[`weight_${serviceIndex}_${optionIndex}`] && (
                                <small className="error-message">
                                  {validationErrors[`weight_${serviceIndex}_${optionIndex}`]}
                                </small>
                              )}
                              {(() => {
                                const overlapError = checkWeightRangeOverlap(serviceIndex, optionIndex);
                                return overlapError && (
                                  <small className="error-message">{overlapError}</small>
                                );
                              })()}
                            </div>
                            <div className="form-group">
                              <label>
                                Price <span className="required">*</span>
                              </label>
                              <div className="input-with-button">
                                <input
                                  type="number"
                                  value={option.price}
                                  onChange={(e) =>
                                    updateServiceOption(
                                      serviceIndex,
                                      optionIndex,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  placeholder="00.00"
                                  step="0.01"
                                  min="0"
                                  required
                                />
                                {service.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeServiceOption(serviceIndex, optionIndex)}
                                    className="icon-btn"
                                  >
                                    <X size={20} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addServiceOption(serviceIndex)}
                        className="add-price-btn"
                      >
                        + Add Price
                      </button>
                    </div>

                    {serviceIndex === services.length - 1 && (
                      <div className="service-type-buttons-inline">
                        <button
                          type="button"
                          onClick={() => addService("package")}
                          className="btn-outline"
                        >
                          + Add Package
                        </button>
                        <button
                          type="button"
                          onClick={() => addService("individual")}
                          className="btn-outline"
                        >
                          + Add Individual Service
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-back">
                  <span>←</span> Back
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}

          {modalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-body">
                  <h2 className="modal-title">Furtastic! You've successfully submitted your application</h2>
                  <p className="modal-text">
                    We'll review it and notify you once your application is approved
                  </p>
                  <button onClick={handleModalClose} className="btn-return">
                    Return to home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}