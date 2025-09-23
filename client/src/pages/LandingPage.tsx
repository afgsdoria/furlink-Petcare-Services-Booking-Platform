import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h2>What furlink is</h2>
        <p>
          furlink offers a hassle-free experience for both customers and service
          providers. It enables grooming businesses to advertise their services
          while allowing pet owners to discover, schedule, and manage
          appointments in one place.
        </p>
      </section>
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h2>How to use furlink</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <div>
            <h3>Pet Owner</h3>
            <p>Discover providers and book services.</p>
          </div>
          <div>
            <h3>Service Provider</h3>
            <p>Register your business and manage bookings.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
