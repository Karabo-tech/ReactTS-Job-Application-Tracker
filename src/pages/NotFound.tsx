// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;