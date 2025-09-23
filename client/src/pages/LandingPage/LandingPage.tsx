import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <Hero />

      <section className={styles.section}>
        <h2>What furlink is</h2>
        <p>
          <em>furlink</em> offers a hassle-free experience for both customers
          and service providers. It enables grooming businesses to advertise
          their services while allowing pet owners to discover, schedule, and
          manage appointments in one place. It also includes an innovative
          AI-powered grooming preview tool.
        </p>
      </section>

      <section className={styles.section}>
        <h2>How to use furlink</h2>
        <div className={styles.cards}>
          <div className={styles.card}>🐾 Pet Owner</div>
          <div className={styles.card}>🏠 Service Provider</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;