// src/pages/JobPage.tsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import styles from './JobPage.module.css';

interface Job {
  id?: number;
  userId: number;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
  details: {
    address: string;
    contact: string;
    duties: string;
    requirements: string;
  };
}

const initialJob: Job = {
  userId: 0,
  company: '',
  role: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().split('T')[0],
  details: { address: '', contact: '', duties: '', requirements: '' },
};

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const location = useLocation();
  const editModeFromQuery = new URLSearchParams(location.search).get('edit') === 'true';
  const [job, setJob] = useState<Job>(initialJob);
  const [editMode, setEditMode] = useState(isNew || editModeFromQuery);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = auth?.user?.id;

  useEffect(() => {
    if (!userId) {
      setToast({ message: 'Please log in to add or edit jobs', type: 'error' });
      navigate('/login');
      return;
    }

    if (!isNew && id) {
      const fetchJob = async () => {
        try {
          // Type the axios response
          const res = await axios.get<Job>(`http://localhost:3001/jobs/${id}`);
          
          if (res.data.userId !== userId) {
            setToast({ message: 'Unauthorized access', type: 'error' });
            navigate('/home');
            return;
          }

          setJob({
            ...res.data,
            details: {
              address: res.data.details.address || '',
              contact: res.data.details.contact || '',
              duties: res.data.details.duties || '',
              requirements: res.data.details.requirements || '',
            },
          });
        } catch (err: any) {
          setToast({ message: 'Failed to fetch job', type: 'error' });
          console.error('Fetch error:', err.response?.data || err.message || err);
        }
      };
      fetchJob();
    } else {
      setJob({ ...initialJob, userId: userId || 0 });
    }
  }, [id, isNew, userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('details.')) {
      const detailKey = name.split('.')[1] as keyof Job['details'];
      setJob(prev => ({
        ...prev,
        details: { ...prev.details, [detailKey]: value },
      }));
    } else {
      setJob(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setToast({ message: 'User not authenticated', type: 'error' });
      navigate('/login');
      return;
    }

    try {
      const payload = { ...job, userId }; // Ensure userId is included

      if (isNew) {
        const res = await axios.post<Job>(`http://localhost:3001/jobs`, payload);
        setToast({ message: 'Job added successfully', type: 'success' });
        setJob(res.data);
      } else {
        const res = await axios.put<Job>(`http://localhost:3001/jobs/${id}`, payload);
        setToast({ message: 'Job updated successfully', type: 'success' });
        setJob(res.data);
      }

      setEditMode(false);
      setTimeout(() => navigate('/home'), 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Unknown error';
      setToast({ message: `Failed to save job: ${errorMessage}`, type: 'error' });
      console.error('Save error:', err.response?.status, errorMessage);
    }
  };

  return (
    <div className={styles.jobPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>{isNew ? 'Add New Job' : editMode ? 'Edit Job' : 'Job Details'}</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="company" className={styles.label}>Company Name</label>
            <input
              name="company"
              id="company"
              placeholder="Enter company name"
              value={job.company}
              onChange={handleChange}
              required
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="role" className={styles.label}>Role</label>
            <input
              name="role"
              id="role"
              placeholder="Enter role"
              value={job.role}
              onChange={handleChange}
              required
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>Status</label>
            <select
              name="status"
              id="status"
              value={job.status}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.select}
            >
              <option>Applied</option>
              <option>Interviewed</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="dateApplied" className={styles.label}>Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              id="dateApplied"
              value={job.dateApplied}
              onChange={handleChange}
              required
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="address" className={styles.label}>Company Address</label>
            <input
              name="details.address"
              id="address"
              placeholder="Enter company address"
              value={job.details.address}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact" className={styles.label}>Contact Details</label>
            <input
              name="details.contact"
              id="contact"
              placeholder="Enter contact details"
              value={job.details.contact}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="duties" className={styles.label}>Job Duties</label>
            <textarea
              name="details.duties"
              id="duties"
              placeholder="Enter job duties"
              value={job.details.duties}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="requirements" className={styles.label}>Requirements</label>
            <textarea
              name="details.requirements"
              id="requirements"
              placeholder="Enter requirements"
              value={job.details.requirements}
              onChange={handleChange}
              disabled={!editMode}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            {editMode ? (
              <>
                <button type="submit" className={styles.submit}>
                  {isNew ? 'Add' : 'Update'}
                </button>
                {!isNew && (
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className={styles.editButton}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default JobPage;
