// src/components/Navbar.tsx
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Toast from './Toast';
import styles from './Navbar.module.css';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleLogout = () => {
    auth?.logout();
    setToast({ message: 'Logged out successfully', type: 'success' });
    navigate('/login');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            Job Tracker
          </Link>
          <div className={styles.links}>
            {!auth?.user ? (
              <>
                <Link to="/login" className={styles.link}>
                  Login
                </Link>
                <Link to="/register" className={styles.link}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/home" className={styles.link}>
                  Home
                </Link>
                <button onClick={handleLogout} className={styles.link}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default Navbar;