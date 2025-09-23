import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <h1>Link with service providers in just one click</h1>
      <Link to="/signup">
        <button className={styles.btn}>Book Now</button>
      </Link>
    </section>
  );
}

export default Hero;
