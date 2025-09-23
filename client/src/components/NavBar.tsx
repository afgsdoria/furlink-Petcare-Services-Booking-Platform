import React from "react";
import styles from "../styles/NavBar.module.css";

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>furlink</div>
      <div className={styles.links}>
        <a href="#about">About furlink</a>
        <a href="/signup">Sign Up</a>
        <a href="/login">Login</a>
      </div>
    </nav>
  );
};

export default NavBar;
