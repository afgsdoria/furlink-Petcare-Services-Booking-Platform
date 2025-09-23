import React from "react";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <>
      <NavBar />
      <main>
        <Hero />

        <section id="about" style={{ padding: "3rem", textAlign: "center" }}>
          <h2>What is furlink?</h2>
          <p>
            furlink is a platform that connects pet owners with grooming service
            providers, making booking appointments simple and hassle-free.
          </p>
        </section>

        <section style={{ padding: "3rem", textAlign: "center" }}>
          <h2>How to use furlink</h2>
          <p>
            1. Sign up and create your account.<br />
            2. Browse service providers.<br />
            3. Book an appointment and manage your bookings.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
