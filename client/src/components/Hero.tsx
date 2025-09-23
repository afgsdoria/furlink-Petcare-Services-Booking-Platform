import React from "react";
import styles from "../styles/Hero.module.css";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <h1>Link with service providers in just one click</h1>
      <button
        className={styles.ctaButton}
        onClick={() => (window.location.href = "/signup")}
      >
        Book Now
      </button>
    </section>
  );
};

export default Hero;
