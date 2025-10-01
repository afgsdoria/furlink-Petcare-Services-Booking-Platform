import React, { useState } from "react";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import "../styles/ServiceSetupPage.css";

const petSizes = ["xs", "s", "m", "l", "xl"];
const petTypes = ["dog", "cat"];
const serviceTypes = ["package", "individual"];

// Exported validation functions for TDD
export function validateBusinessInfo(businessInfo, facilityImages, paymentChannelFiles, businessPermitFile, employees) {
  const requiredFields = [
    "businessName",
    "businessEmail",
    "businessMobile",
    "operatingHours",
    "houseStreet",
    "barangay",
    "city",
    "province",
    "postalCode",
    "country",
    "typeOfService",
  ];
  for (let field of requiredFields) {
    if (!businessInfo[field] || !businessInfo[field].trim()) return false;
  }
  if (facilityImages.length === 0) return false;
  if (paymentChannelFiles.length === 0) return false;
  if (!businessPermitFile) return false;
  for (let emp of employees) {
    if (!emp.fullName.trim() || !emp.position.trim()) return false;
  }
  return true;
}

export function validateServiceInfo(serviceType, serviceName, description, serviceOptions) {
  if (!serviceType) return false;
  if (!serviceName.trim() || !description.trim()) return false;
  for (let option of serviceOptions) {
    if (
      !option.petType ||
      !option.size ||
      !option.weightRange.trim() ||
      !option.price ||
      isNaN(option.price)
    )
      return false;
  }
  return true;
}

export default function ServiceSetupPage() {
  const [step, setStep] = useState(1);

  // Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessEmail: "",
    businessMobile: "",
    operatingHours: "",
    houseStreet: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Philippines",
    typeOfService: "Pet Grooming Service",
  });

  // Files state
  const [waiverFile, setWaiverFile] = useState(null);
  const [facilityImages, setFacilityImages] = useState([]);
  const [paymentChannelFiles, setPaymentChannelFiles] = useState([]);
  const [businessPermitFile, setBusinessPermitFile] = useState(null);

  // Employees state
  const [employees, setEmployees] = useState([{ fullName: "", position: "" }]);

  // Service Info State
  const [serviceType, setServiceType] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceOptions, setServiceOptions] = useState([
    { petType: "dog", size: "xs", weightRange: "", price: "" },
  ]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Business Info Handlers
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({ ...prev, [name]: value }));
  };

  // File Handlers
  const handleFileChange = (setter, multiple = false, maxFiles = null, maxSizeMB = null) => (e) => {
    const files = multiple ? Array.from(e.target.files) : e.target.files[0] ? [e.target.files[0]] : [];
    if (maxFiles && files.length + (multiple ? 0 : 0) > maxFiles) {
      alert(`You can upload up to ${maxFiles} files.`);
      e.target.value = null;
      return;
    }
    if (maxSizeMB) {
      for (let file of files) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          alert(`File ${file.name} exceeds the size limit of ${maxSizeMB}MB.`);
          e.target.value = null;
          return;
        }
      }
    }
    if (multiple) {
      setter((prev) => [...prev, ...files]);
    } else {
      setter(files[0] || null);
    }
  };

  // Remove file helpers
  const removeFileAtIndex = (arr, setter, index) => {
    setter(arr.filter((_, i) => i !== index));
  };

  // Employee Handlers
  const handleEmployeeChange = (index, e) => {
    const { name, value } = e.target;
    const newEmployees = [...employees];
    newEmployees[index][name] = value;
    setEmployees(newEmployees);
  };
  const addEmployee = () => setEmployees((prev) => [...prev, { fullName: "", position: "" }]);
  const removeEmployee = (index) => {
    if (employees.length === 1) return;
    setEmployees((prev) => prev.filter((_, i) => i !== index));
  };

  // Service Info Handlers
  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
    setServiceName("");
    setDescription("");
    setNotes("");
    setServiceOptions([{ petType: "dog", size: "xs", weightRange: "", price: "" }]);
  };
  const handleServiceOptionChange = (index, e) => {
    const { name, value } = e.target;
    const newOptions = [...serviceOptions];
    newOptions[index][name] = value;
    setServiceOptions(newOptions);
  };
  const addServiceOption = () => setServiceOptions((prev) => [...prev, { petType: "dog", size: "xs", weightRange: "", price: "" }]);
  const removeServiceOption = (index) => {
    if (serviceOptions.length === 1) return;
    setServiceOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Navigation Handlers
  const handleNext = (e) => {
    e.preventDefault();
    if (validateBusinessInfo(businessInfo, facilityImages, paymentChannelFiles, businessPermitFile, employees)) {
      setStep(2);
    } else {
      alert("Please fill all required business info fields and upload required files.");
    }
  };
  const handleBack = () => setStep(1);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateServiceInfo(serviceType, serviceName, description, serviceOptions)) {
      setModalOpen(true);
    } else {
      alert("Please fill all required service info fields correctly.");
    }
  };
  const handleModalClose = () => {
    setModalOpen(false);
    window.location.href = "/dashboard";
  };

  return (
    <>
      <LoggedInNavbar />
      <main className="service-setup-container">
        <h1 className="page-title">Service Setup</h1>

        <form
          className="service-setup-form"
          onSubmit={step === 1 ? handleNext : handleSubmit}
          encType="multipart/form-data"
          data-testid="service-setup-form"
        >
          {/* Part 1 */}
          {step === 1 && (
            <section className="form-part business-info" data-testid="business-info-part">
              <h2>Part 1: Business Information</h2>

              {/* Row 1 */}
              <div className="form-row">
                <label>
                  Business Name <span className="required">*</span>
                  <input
                    type="text"
                    name="businessName"
                    value={businessInfo.businessName}
                    onChange={handleBusinessChange}
                    required
                    data-testid="businessName"
                  />
                </label>
                <label>
                  Business Email <span className="required">*</span>
                  <input
                    type="email"
                    name="businessEmail"
                    value={businessInfo.businessEmail}
                    onChange={handleBusinessChange}
                    required
                    data-testid="businessEmail"
                  />
                </label>
                <label>
                  Business Mobile <span className="required">*</span>
                  <input
                    type="tel"
                    name="businessMobile"
                    value={businessInfo.businessMobile}
                    onChange={handleBusinessChange}
                    required
                    data-testid="businessMobile"
                  />
                </label>
                <label>
                  Operating Hours <span className="required">*</span>
                  <input
                    type="text"
                    name="operatingHours"
                    value={businessInfo.operatingHours}
                    onChange={handleBusinessChange}
                    placeholder="e.g. Mon-Fri 9am-6pm"
                    required
                    data-testid="operatingHours"
                  />
                </label>
              </div>

              {/* Row 2 */}
              <div className="form-row">
                <label>
                  House/Street <span className="required">*</span>
                  <input
                    type="text"
                    name="houseStreet"
                    value={businessInfo.houseStreet}
                    onChange={handleBusinessChange}
                    required
                    data-testid="houseStreet"
                  />
                </label>
                <label>
                  Barangay <span className="required">*</span>
                  <input
                    type="text"
                    name="barangay"
                    value={businessInfo.barangay}
                    onChange={handleBusinessChange}
                    required
                    data-testid="barangay"
                  />
                </label>
                <label>
                  City/Municipality <span className="required">*</span>
                  <input
                    type="text"
                    name="city"
                    value={businessInfo.city}
                    onChange={handleBusinessChange}
                    required
                    data-testid="city"
                  />
                </label>
                <label>
                  Province <span className="required">*</span>
                  <input
                    type="text"
                    name="province"
                    value={businessInfo.province}
                    onChange={handleBusinessChange}
                    required
                    data-testid="province"
                  />
                </label>
                <label>
                  Postal Code <span className="required">*</span>
                  <input
                    type="text"
                    name="postalCode"
                    value={businessInfo.postalCode}
                    onChange={handleBusinessChange}
                    required
                    data-testid="postalCode"
                  />
                </label>
                <label>
                  Country <span className="required">*</span>
                  <input
                    type="text"
                    name="country"
                    value={businessInfo.country}
                    onChange={handleBusinessChange}
                    disabled
                    data-testid="country"
                  />
                </label>
              </div>

              {/* Row 3 - File uploads */}
              <div className="form-row file-uploads-row">
                {/* Waiver */}
                <div className="file-upload-group">
                  <label>
                    Waiver (Optional)
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange(setWaiverFile, false)}
                      data-testid="waiverFile"
                    />
                  </label>
                  {waiverFile && (
                    <div className="file-preview" data-testid="waiverFilePreview">
                      <span>{waiverFile.name}</span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setWaiverFile(null)}
                        title="Remove file"
                        data-testid="removeWaiverFile"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                {/* Images of Facilities */}
                <div className="file-upload-group">
                  <label>
                    Images of Facilities <span className="required">*</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange(setFacilityImages, true)}
                      data-testid="facilityImages"
                    />
                  </label>
                  {facilityImages.length > 0 && (
                    <div className="file-preview-list" data-testid="facilityImagesPreview">
                      {facilityImages.map((file, i) => (
                        <div key={i} className="file-preview">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFileAtIndex(facilityImages, setFacilityImages, i)}
                            title="Remove file"
                            data-testid={`removeFacilityImage-${i}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Channel */}
                <div className="file-upload-group">
                  <label>
                    Payment Channel (QR Codes) <span className="required">*</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange(setPaymentChannelFiles, true, 3)}
                      data-testid="paymentChannelFiles"
                    />
                  </label>
                  {paymentChannelFiles.length > 0 && (
                    <div className="file-preview-list" data-testid="paymentChannelFilesPreview">
                      {paymentChannelFiles.map((file, i) => (
                        <div key={i} className="file-preview">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeFileAtIndex(paymentChannelFiles, setPaymentChannelFiles, i)}
                            title="Remove file"
                            data-testid={`removePaymentChannelFile-${i}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Business Permit */}
                <div className="file-upload-group">
                  <label>
                    Business Permit <span className="required">*</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange(setBusinessPermitFile, false, null, 1)}
                      data-testid="businessPermitFile"
                    />
                  </label>
                  {businessPermitFile && (
                    <div className="file-preview" data-testid="businessPermitFilePreview">
                      <span>{businessPermitFile.name}</span>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setBusinessPermitFile(null)}
                        title="Remove file"
                        data-testid="removeBusinessPermitFile"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4 - Employees */}
              <div className="form-row employees-row">
                <label className="employees-label">
                  Employee Information <span className="required">*</span>
                </label>
                {employees.map((emp, index) => (
                  <div key={index} className="employee-row" data-testid={`employeeRow-${index}`}>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={emp.fullName}
                      onChange={(e) => handleEmployeeChange(index, e)}
                      required
                      data-testid={`employeeFullName-${index}`}
                    />
                    <input
                      type="text"
                      name="position"
                      placeholder="Position"
                      value={emp.position}
                      onChange={(e) => handleEmployeeChange(index, e)}
                      required
                      data-testid={`employeePosition-${index}`}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeEmployee(index)}
                      title="Remove employee"
                      disabled={employees.length === 1}
                      data-testid={`removeEmployee-${index}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary add-employee-btn"
                  onClick={addEmployee}
                  data-testid="addEmployeeBtn"
                >
                  + Add Employee
                </button>
              </div>

              <div className="form-navigation">
                <button type="submit" className="btn btn-primary" data-testid="nextBtn">
                  Next
                </button>
              </div>
            </section>
          )}

          {/* Part 2 */}
          {step === 2 && (
            <section className="form-part service-info" data-testid="service-info-part">
              <h2>Part 2: Service Information</h2>

              <label>
                What service do you want to add? <span className="required">*</span>
                <select
                  value={serviceType}
                  onChange={handleServiceTypeChange}
                  required
                  data-testid="serviceTypeSelect"
                >
                  <option value="" disabled>
                    Select service type
                  </option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              {serviceType && (
                <>
                  <label>
                    Service Name <span className="required">*</span>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      required
                      data-testid="serviceName"
                    />
                  </label>

                  <label>
                    Description <span className="required">*</span>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      data-testid="serviceDescription"
                    />
                  </label>

                  <label>
                    Notes
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional"
                      data-testid="serviceNotes"
                    />
                  </label>

                  <fieldset className="service-options" data-testid="serviceOptionsFieldset">
                    <legend>Service Options</legend>
                                        {serviceOptions.map((option, index) => (
                      <div key={index} className="option-row" data-testid={`serviceOptionRow-${index}`}>
                        <label>
                          Pet Type <span className="required">*</span>
                          <select
                            name="petType"
                            value={option.petType}
                            onChange={(e) => handleServiceOptionChange(index, e)}
                            required
                            data-testid={`optionPetType-${index}`}
                          >
                            {petTypes.map((pt) => (
                              <option key={pt} value={pt}>
                                {pt.charAt(0).toUpperCase() + pt.slice(1)}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Size <span className="required">*</span>
                          <select
                            name="size"
                            value={option.size}
                            onChange={(e) => handleServiceOptionChange(index, e)}
                            required
                            data-testid={`optionSize-${index}`}
                          >
                            {petSizes.map((size) => (
                              <option key={size} value={size}>
                                {size.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Weight Range <span className="required">*</span>
                          <input
                            type="text"
                            name="weightRange"
                            value={option.weightRange}
                            onChange={(e) => handleServiceOptionChange(index, e)}
                            placeholder="e.g. 0-5kg"
                            required
                            data-testid={`optionWeightRange-${index}`}
                          />
                        </label>

                        <label>
                          Price (₱) <span className="required">*</span>
                          <input
                            type="number"
                            name="price"
                            value={option.price}
                            onChange={(e) => handleServiceOptionChange(index, e)}
                            min="0"
                            step="0.01"
                            required
                            data-testid={`optionPrice-${index}`}
                          />
                        </label>

                        <button
                          type="button"
                          className="btn btn-danger remove-option"
                          onClick={() => removeServiceOption(index)}
                          title="Remove option"
                          disabled={serviceOptions.length === 1}
                          data-testid={`removeServiceOption-${index}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-secondary add-option"
                      onClick={addServiceOption}
                      data-testid="addServiceOptionBtn"
                    >
                      + Add Option
                    </button>
                  </fieldset>

                  <div className="form-navigation">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                      data-testid="backBtn"
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary" data-testid="submitBtn">
                      Submit Application
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </form>

        {/* Modal */}
        {modalOpen && (
          <div className="modal-overlay" data-testid="submissionModal">
            <div className="modal-content">
              <h3>Application Submitted</h3>
              <p>Your service application has been submitted successfully.</p>
              <button
                className="btn btn-primary"
                onClick={handleModalClose}
                data-testid="goToDashboardBtn"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
