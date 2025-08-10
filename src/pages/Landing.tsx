// src/pages/Landing.tsx
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landing}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Job Application Tracker</h1>
        <p className={styles.description}>
          Track your job applications with ease. Monitor statuses, add detailed job information, and stay organized in your job search journey.
        </p>
        <div className={styles.buttons}>
          <a href="/login" className={styles.button}>
            Login
          </a>
          <a href="/register" className={styles.button}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;