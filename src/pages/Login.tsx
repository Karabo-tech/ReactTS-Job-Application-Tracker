// src/pages/Login.tsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import styles from './Login.module.css';

interface LoginData {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  // add other fields returned by your backend, e.g., token
}

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({ username: '', password: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Type the response explicitly
      const res = await axios.post<User>('http://localhost:3001/users', formData);
      auth?.login(res.data); // Now TS knows res.data is a User
      setToast({ message: 'Logged in successfully', type: 'success' });
      setTimeout(() => navigate('/home'), 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Unknown error';
      setToast({ message: `Failed to log in: ${errorMessage}`, type: 'error' });
      console.error('Login error:', errorMessage);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Log In</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.submit}>
              Log In
            </button>
          </div>
          <p className={styles.linkText}>
            Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
          </p>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
