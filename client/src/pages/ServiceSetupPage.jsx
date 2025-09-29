import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";
import "../styles/pages/ServiceSetupPage.css";

const ServiceSetupPage = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <LoggedInNavbar hideProviderBtn={true} />
      <div className="service-setup-container">
        <h2>Service Provider Application</h2>

        <form className="service-form" onSubmit={handleSubmit}>
          {/* STEP 1: Business Info */}
          {step === 1 && (
            <>
              {/* Row 1 */}
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Business Name <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>
                    Business Email <span className="required">*</span>
                  </label>
                  <input type="email" required />
                </div>
                <div className="form-group">
                  <label>
                    Business Mobile Number <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
              </div>

              {/* Row 2: Address */}
              <div className="form-row">
                <div className="form-group">
                  <label>
                    House No. & Street <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>
                    Barangay <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>
                    City/Municipality <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>
                    Province <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>
                    Postal Code <span className="required">*</span>
                  </label>
                  <input type="text" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" value="Philippines" disabled />
                </div>
              </div>

              {/* Row 3 */}
              <div className="form-row">
                <div className="form-group">
                  <label>Type of Service</label>
                  <input type="text" value="Pet Grooming Service" disabled />
                </div>

                <div className="form-group">
                  <label>
                    Business Facilities <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <FaUpload className="upload-icon" />
                    <input type="file" multiple />
                  </div>
                  <p className="field-note">
                    Upload up to 10 pictures of your facilities.
                  </p>
                </div>

                <div className="form-group">
                  <label>Business Waiver</label>
                  <div className="file-upload">
                    <FaUpload className="upload-icon" />
                    <input type="file" />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Business Permits <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <FaUpload className="upload-icon" />
                    <input type="file" multiple />
                  </div>
                  <p className="field-note">
                    You may upload a DTI, Mayor's, and BIR Permit.
                  </p>
                </div>

                <div className="form-group">
                  <label>
                    Payment Methods <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <FaUpload className="upload-icon" />
                    <input type="file" multiple />
                  </div>
                  <p className="field-note">
                    Upload Payment Method where you want to receive customer's
                    down payment.
                  </p>
                </div>
              </div>

              {/* Row 4: Staff */}
              <div className="form-group">
                <label>
                  Groomer/Staff Information <span className="required">*</span>
                </label>
                <div className="staff-row">
                  <input type="text" placeholder="Name" required />
                  <input type="number" placeholder="Years of Experience" required />
                  <input type="text" placeholder="Skills" required />
                  <button type="button" className="small-add-btn">
                    + Add More Staff
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next
                </button>
              </div>
            </>
          )}

          {/* STEP 2 remains unchanged */}
          {step === 2 && (
            <>
              {/* ... service offerings code here (unchanged) ... */}
              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <Footer />

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Application Submitted</h3>
            <p>Your application has been submitted for review by the admin.</p>
            <div className="modal-actions">
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="back-btn"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="next-btn"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceSetupPage;
