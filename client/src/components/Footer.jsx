import React from "react";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p>© {new Date().getFullYear()} furlink</p>
        <span>Terms and Conditions</span>
        <span>Privacy Policy</span>
      </div>

      <div className="footer-right">
        <a href="https://www.facebook.com/profile.php?id=61576298152992" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a
          href="https://www.instagram.com/furbnb_startup/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a href="mailto:logiteh045@gmail.com">
          <FaEnvelope />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
