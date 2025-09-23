import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <p>© 2025 furlink</p>
        <a href="/terms">Terms and Conditions</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <div className={styles.right}>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="mailto:info@furlink.com">Email</a>
      </div>
    </footer>
  );
}

export default Footer;
