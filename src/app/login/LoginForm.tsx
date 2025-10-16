"use client";

import React from "react";
import styles from "./login-form.module.css";

const LoginForm = () => {
  return (
    <form className={styles.form}>
      <div className={styles["flex-column"]}>
        <label htmlFor="email">Email</label>
      </div>
      <div className={styles.inputForm}>
        <input
          type="email"
          className={styles.input}
          placeholder="Enter your email"
          id="email"
          required
        />
      </div>
      <div className={styles["flex-column"]}>
        <label htmlFor="password">Password</label>
      </div>
      <div className={styles.inputForm}>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter your password"
          id="password"
          required
        />
      </div>
      <div className={styles["flex-row"]}>
        <div>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember"> Remember me</label>
        </div>
        <span className={styles.span}>Forgot password?</span>
      </div>
      <button type="submit" className={styles["button-submit"]}>
        Log In
      </button>
  <p className={styles.p}>Don&apos;t have an account? <span className={styles.span}>Sign up</span></p>
      <button type="button" className={styles.btn}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.805 10.023c-.11-.396-.432-.707-.828-.8l-7.02-1.62-3.13-6.6c-.18-.38-.56-.62-.97-.62-.41 0-.79.24-.97.62l-3.13 6.6-7.02 1.62c-.396.09-.718.404-.828.8-.11.396.01.82.31 1.09l5.36 4.7-1.27 7.01c-.07.41.1.83.43 1.08.33.25.77.28 1.13.08l6.29-3.3 6.29 3.3c.16.08.33.12.5.12.22 0 .44-.07.63-.2.33-.25.5-.67.43-1.08l-1.27-7.01 5.36-4.7c.3-.27.42-.69.31-1.09z" />
        </svg>
        Log in with Google
      </button>
    </form>
  );
};

export default LoginForm;
