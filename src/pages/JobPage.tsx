// src/pages/JobPage.tsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Select, Textarea, Container, Card } from '../components';
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
      <Container size="md">
        <h1 className={styles.title}>{isNew ? 'Add New Job' : editMode ? 'Edit Job' : 'Job Details'}</h1>
        <Card>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Company Name"
              name="company"
              id="company"
              placeholder="Enter company name"
              value={job.company}
              onChange={handleChange}
              required
              disabled={!editMode}
              fullWidth
            />

            <Input
              label="Role"
              name="role"
              id="role"
              placeholder="Enter role"
              value={job.role}
              onChange={handleChange}
              required
              disabled={!editMode}
              fullWidth
            />

            <Select
              label="Status"
              name="status"
              id="status"
              value={job.status}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            >
              <option>Applied</option>
              <option>Interviewed</option>
              <option>Rejected</option>
            </Select>

            <Input
              label="Date Applied"
              type="date"
              name="dateApplied"
              id="dateApplied"
              value={job.dateApplied}
              onChange={handleChange}
              required
              disabled={!editMode}
              fullWidth
            />

            <Input
              label="Company Address"
              name="details.address"
              id="address"
              placeholder="Enter company address"
              value={job.details.address}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />

            <Input
              label="Contact Details"
              name="details.contact"
              id="contact"
              placeholder="Enter contact details (email or phone)"
              value={job.details.contact}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
            />

            <Textarea
              label="Job Duties"
              name="details.duties"
              id="duties"
              placeholder="Describe the job duties and responsibilities"
              value={job.details.duties}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              rows={4}
            />

            <Textarea
              label="Requirements"
              name="details.requirements"
              id="requirements"
              placeholder="List the job requirements and qualifications"
              value={job.details.requirements}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              rows={4}
            />

            <div className={styles.actions}>
              {editMode ? (
                <>
                  <Button type="submit" variant="primary" size="md" fullWidth>
                    {isNew ? 'Add Job' : 'Update Job'}
                  </Button>
                  {!isNew && (
                    <Button
                      type="button"
                      onClick={() => setEditMode(false)}
                      variant="secondary"
                      size="md"
                      fullWidth
                    >
                      Cancel
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => setEditMode(true)}
                    variant="success"
                    size="md"
                    fullWidth
                  >
                    Edit Job
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate('/home')}
                    variant="secondary"
                    size="md"
                    fullWidth
                  >
                    Back to List
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>
      </Container>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default JobPage;
