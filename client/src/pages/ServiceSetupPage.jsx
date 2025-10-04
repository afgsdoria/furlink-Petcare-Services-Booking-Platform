import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import Header from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import "../styles/ServiceSetupPage.css";

const petSizes = ["xs", "s", "m", "l", "xl"];
const petTypes = ["dog", "cat"];

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
    for (let option of service.options) {
      if (
        !option.petType ||
        !option.size ||
        !option.weightRange.trim() ||
        !option.price ||
        isNaN(Number(option.price))
      )
        return false;
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
    operatingHours: [
      {
        days: [],
        startTime: "9:00",
        endTime: "17:00",
      },
    ],
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

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (slotIndex, day) => {
    setBusinessInfo((prev) => ({
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
    }));
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
      operatingHours: [
        ...prev.operatingHours,
        { days: [], startTime: "9:00", endTime: "17:00" },
      ],
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
        options: [{ petType: "dog", size: "xs", weightRange: "", price: "" }],
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
                { petType: "dog", size: "xs", weightRange: "", price: "" },
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
              options: service.options.map((opt, j) =>
                j === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : service
      )
    );
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateServiceInfo(services)) {
      setValidationErrors({});
      setModalOpen(true);
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        step2: "Please add at least one service and fill all required fields.",
      }));
    }
  };

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
                  <label>
                    Operating Hours <span className="required">*</span>
                  </label>
                  {businessInfo.operatingHours.map((slot, slotIndex) => (
                    <div key={slotIndex} className="operating-hours">
                      <div className="day-selector">
                        {daysOfWeek.map((day, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`day-btn ${
                              slot.days.includes(dayNames[i]) ? "active" : ""
                            }`}
                            onClick={() => toggleDay(slotIndex, dayNames[i])}
                          >
                            {day}
                          </button>
                        ))}
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
                  <button type="button" onClick={addTimeSlot} className="add-timeslot-btn">
                    + Add timeslot
                  </button>
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
                                {petTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </option>
                                ))}
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
                                {petSizes.map((size) => (
                                  <option key={size} value={size}>
                                    {size.toUpperCase()}
                                  </option>
                                ))}
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
                                placeholder="1 kg - 5 kg"
                                required
                              />
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
                <button type="submit" className="btn-submit">
                  Submit Application
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
                  <div className="modal-illustration">
                    <svg viewBox="0 0 800 200" className="pets-illustration">
                      <g>
                        <circle cx="100" cy="100" r="50" fill="#FF9966" />
                        <path d="M 80 80 L 70 70 M 120 80 L 130 70" stroke="#000" strokeWidth="2" fill="none" />
                        <circle cx="90" cy="90" r="3" fill="#000" />
                        <circle cx="110" cy="90" r="3" fill="#000" />
                        <path d="M 85 105 Q 100 110 115 105" stroke="#000" strokeWidth="2" fill="none" />
                        <line x1="70" y1="105" x2="50" y2="100" stroke="#000" strokeWidth="2" />
                        <line x1="70" y1="110" x2="50" y2="110" stroke="#000" strokeWidth="2" />
                        <line x1="130" y1="105" x2="150" y2="100" stroke="#000" strokeWidth="2" />
                        <line x1="130" y1="110" x2="150" y2="110" stroke="#000" strokeWidth="2" />
                      </g>

                      <g>
                        <circle cx="250" cy="100" r="50" fill="#C4A484" />
                        <ellipse cx="230" cy="70" rx="15" ry="25" fill="#8B6F47" />
                        <ellipse cx="270" cy="70" rx="15" ry="25" fill="#8B6F47" />
                        <circle cx="240" cy="90" r="3" fill="#000" />
                        <circle cx="260" cy="90" r="3" fill="#000" />
                        <ellipse cx="250" cy="105" rx="8" ry="10" fill="#000" />
                        <path d="M 245 115 Q 250 118 255 115" stroke="#000" strokeWidth="2" fill="none" />
                      </g>

                      <g>
                        <ellipse cx="420" cy="100" r="50" fill="#000" />
                        <path d="M 390 70 L 380 60 M 420 85 L 410 75" stroke="#FFF" strokeWidth="2" fill="none" />
                        <circle cx="400" cy="90" r="3" fill="#FFF" />
                        <circle cx="420" cy="90" r="3" fill="#FFF" />
                        <path d="M 450 95 L 470 90" stroke="#FF6B9D" strokeWidth="3" />
                        <ellipse cx="415" cy="105" rx="6" ry="8" fill="#FFF" />
                        <path d="M 410 115 Q 415 118 420 115" stroke="#FFF" strokeWidth="2" fill="none" />
                        <circle cx="460" cy="95" r="8" fill="#FF6B9D" />
                      </g>

                      <g>
                        <circle cx="600" cy="100" r="50" fill="#E8D4C0" />
                        <ellipse cx="580" cy="70" rx="15" ry="25" fill="#C4A484" />
                        <ellipse cx="620" cy="70" rx="15" ry="25" fill="#C4A484" />
                        <circle cx="555" cy="85" r="18" fill="#8B6F47" />
                        <circle cx="645" cy="85" r="18" fill="#8B6F47" />
                        <circle cx="590" cy="95" r="3" fill="#000" />
                        <circle cx="610" cy="95" r="3" fill="#000" />
                        <ellipse cx="600" cy="110" rx="8" ry="10" fill="#000" />
                        <path d="M 595 120 Q 600 123 605 120" stroke="#000" strokeWidth="2" fill="none" />
                        <circle cx="615" cy="108" r="8" fill="#FFB6C1" />
                      </g>
                    </svg>
                  </div>
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