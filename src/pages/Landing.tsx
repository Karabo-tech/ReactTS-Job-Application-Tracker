// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Container from '../components/Container';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landing}>
      <Container size="lg">
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to Job Application Tracker</h1>
          <p className={styles.description}>
            Track your job applications with ease. Monitor statuses, add detailed job information, and stay organized in your job search journey.
          </p>
          <div className={styles.buttons}>
            <Link to="/login">
              <Button variant="primary" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="success" size="lg">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Landing;