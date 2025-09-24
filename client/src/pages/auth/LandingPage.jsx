import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/LandingPage.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Link with service providers
              <span className="hero-highlight"> in just one click</span>
            </h1>
            <p className="hero-description">
              Connect with trusted pet grooming professionals in your area. 
              Safe, reliable, and convenient pet care at your fingertips.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="hero-cta"
            >
              Book now
              <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Illustration stays the same */}
          <div className="hero-image">
            <div className="pet-scene">{/* your pet illustration */}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="about">
    <div className="about-container">
      <h2 className="about-title">What furlink is</h2>
      <p className="about-text">
        <strong>furlink</strong> offers a hassle-free experience for both customers and service providers...
      </p>
    </div>
  </section>
);

const HowToUseSection = () => (
  <section className="how-to-use">
    <div className="how-to-use-container">
      <h2 className="section-title">How to use furlink</h2>
      {/* cards for pet owner and service provider */}
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <AboutSection />
      <HowToUseSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
