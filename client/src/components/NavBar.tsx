import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NavBar.module.css";

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>furlink</div>
      <div className={styles.links}>
        <Link to="/">About furlink</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
      </div>
    </nav>
  );
};

export default NavBar;
