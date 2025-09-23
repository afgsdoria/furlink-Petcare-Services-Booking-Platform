import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import styles from "../styles/SignUpPage.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6"; // ✅ Correct import
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.container}>
        <h2>Create Your Account</h2>
        <p className={styles.subtitle}>
          Join FurLink and give your pet the premium care they deserve
        </p>

        <form className={styles.form}>
          {/* First + Last Name */}
          <div className={styles.row}>
            <div className={styles.field}>
              <input type="text" placeholder="First Name" required />
            </div>
            <div className={styles.field}>
              <input type="text" placeholder="Last Name" required />
            </div>
          </div>

          {/* Email */}
          <div className={styles.field}>
            <input type="email" placeholder="Email Address" required />
          </div>

          {/* Date of Birth */}
          <div className={styles.field}>
            <input type="date" required />
          </div>

          {/* Mobile Number */}
          <div className={styles.field}>
            <input type="tel" placeholder="Mobile Number (+63XXXXXXXXXX)" required />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className={styles.checkbox}>
            <input type="checkbox" required />
            <span>
              I agree to the <Link to="/terms">Terms & Conditions</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </span>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign Up
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
