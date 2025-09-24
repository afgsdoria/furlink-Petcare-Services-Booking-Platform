// src/components/Footer.jsx
import React from "react";
import "../styles/pages/LandingPage.css"; // reuse landing styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left */}
          <div className="footer-left">
            <div className="footer-logo">furlink</div>
            <p className="footer-description">
              Connecting pet owners with trusted grooming service providers across the Philippines.
            </p>
            <p className="footer-copyright">© 2025 furlink</p>
          </div>

          {/* Center */}
          <div className="footer-center">
            <div className="footer-links">
              <button className="footer-link" onClick={() => window.location.href="/terms"}>
                Terms and Conditions
              </button>
              <button className="footer-link" onClick={() => window.location.href="/privacy"}>
                Privacy Policy
              </button>
              <button className="footer-link" onClick={() => window.location.href="/about"}>
                About furlink
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="footer-right">
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61576298152992" className="social-link" target="_blank" rel="noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/furbnb_startup/" className="social-link" target="_blank" rel="noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001z"/>
                </svg>
              </a>
              <a href="mailto:your-email@example.com" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
