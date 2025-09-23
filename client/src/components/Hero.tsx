import { Link } from "react-router-dom";
import styles from "../styles/Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <h1>Link with service providers in just one click</h1>
      <Link to="/signup" className={styles.ctaButton}>
        Book Now
      </Link>
    </section>
  );
};

export default Hero;
