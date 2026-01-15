// src/pages/Register.tsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Container, Card } from '../components';
import styles from './Register.module.css';

interface RegisterData {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({ username: '', password: '' });
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
      setToast({ message: 'Registered successfully', type: 'success' });
      setTimeout(() => navigate('/home'), 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Unknown error';
      setToast({ message: `Failed to register: ${errorMessage}`, type: 'error' });
      console.error('Register error:', errorMessage);
    }
  };

  return (
    <div className={styles.registerPage}>
      <Container size="md">
        <div className={styles.content}>
          <h1 className={styles.title}>Register</h1>
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
                  Register
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/login')}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
              <p className={styles.linkText}>
                Already have an account? <Link to="/login" className={styles.link}>Log In</Link>
              </p>
            </form>
          </Card>
        </div>
      </Container>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Register;
