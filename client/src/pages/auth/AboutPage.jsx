import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/pages/AboutPage.css"; // new CSS file

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Shared Header */}
      <Header />

      <main className="about-container">
        {/* Definition Section */}
        <section className="about-definition">
          <h1>What is furlink?</h1>
          <p>
            <strong>furlink</strong> offers a hassle-free experience for both customers and service providers. 
            It enables grooming businesses to advertise their services while allowing pet owners to discover, 
            schedule, and manage appointments in one place. It also provides an innovative AI-powered grooming 
            preview tool, giving users a visual reference of potential pet haircut styles before booking—bridging 
            the gap between customer expectations and actual grooming outcomes.
          </p>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <h2>Meet the Team</h2>
          <p className="team-subtitle">
            The student developers behind furlink
          </p>

          <div className="team-grid">
            {/* 4 Members */}
            <div className="team-member">
              <div className="photo-placeholder">Photo</div>
              <h3>Student 1</h3>
              <p>Frontend Developer</p>
            </div>
            <div className="team-member">
              <div className="photo-placeholder">Photo</div>
              <h3>Student 2</h3>
              <p>Backend Developer</p>
            </div>
            <div className="team-member">
              <div className="photo-placeholder">Photo</div>
              <h3>Student 3</h3>
              <p>UI/UX Designer</p>
            </div>
            <div className="team-member">
              <div className="photo-placeholder">Photo</div>
              <h3>Student 4</h3>
              <p>Database Specialist</p>
            </div>
          </div>

          {/* Group Photo */}
          <div className="group-photo">
            <div className="photo-placeholder large">Group Photo</div>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
