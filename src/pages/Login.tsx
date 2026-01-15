// src/pages/Login.tsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Container, Card } from '../components';
import styles from './Login.module.css';

interface LoginData {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
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
      const res = await axios.post<User>('http://localhost:3001/users', formData);
      auth?.login(res.data);
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
      <Container size="md">
        <div className={styles.content}>
          <h1 className={styles.title}>Log In</h1>
          <Card>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Username"
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
              />
              <Input
                label="Password"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />
              <div className={styles.actions}>
                <Button type="submit" variant="primary" size="md" fullWidth>
                  Log In
                </Button>
              </div>
              <p className={styles.linkText}>
                Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
              </p>
            </form>
          </Card>
        </div>
      </Container>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Login;
