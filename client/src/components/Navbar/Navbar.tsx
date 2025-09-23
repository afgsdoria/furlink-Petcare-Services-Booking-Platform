import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">furlink</Link>
      </div>
      <div className={styles.links}>
        <Link to="/about">About furlink</Link>
        <Link to="/login">
          <button className={styles.btn}>Login</button>
        </Link>
        <Link to="/signup">
          <button className={styles.btnPrimary}>Sign Up</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
