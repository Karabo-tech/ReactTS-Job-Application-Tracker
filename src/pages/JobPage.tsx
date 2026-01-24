// src/pages/JobPage.tsx
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Select, Textarea, Container, Card } from '../components';
import { jobApi } from '../services/api';
import { useToast } from '../hooks/useToast';
import { convertToDateTimeLocal, formatDateTimeLocal } from '../utils/helpers';
import { ROUTES, TOAST_MESSAGES, JOB_STATUS } from '../config/constants';
import type { Job, ApiError } from '../types';
import styles from './JobPage.module.css';

/**
 * Initial empty job state
 */
const getInitialJob = (userId: number | string): Job => ({
  userId,
  company: '',
  role: '',
  status: JOB_STATUS.APPLIED,
  dateApplied: formatDateTimeLocal(new Date()),
  details: { address: '', contact: '', duties: '', requirements: '' },
});

/**
 * JobPage Component
 * Displays job details and allows creating/editing jobs
 */
const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  const isNew = id === 'new';
  const editModeFromQuery = new URLSearchParams(location.search).get('edit') === 'true';
  const userId = auth?.user?.id;

  // State
  const [job, setJob] = useState<Job>(getInitialJob(userId || 0));
  const [editMode, setEditMode] = useState(isNew || editModeFromQuery);
  const [loading, setLoading] = useState(false);
  
  // Custom hooks
  const { toast, showSuccess, showError, hideToast } = useToast();

  /**
   * Fetch job details when editing an existing job
   */
  useEffect(() => {
    if (!userId) {
      showError(TOAST_MESSAGES.LOGIN_REQUIRED);
      navigate(ROUTES.LOGIN);
      return;
    }

    if (!isNew && id) {
      const fetchJob = async () => {
        setLoading(true);
        try {
          const data = await jobApi.getJobById(id);
          
          // Check if user owns this job
          if (data.userId !== userId) {
            showError(TOAST_MESSAGES.UNAUTHORIZED);
            navigate(ROUTES.HOME);
            return;
          }

          // Convert date-only format to datetime-local for backward compatibility
          const dateApplied = convertToDateTimeLocal(data.dateApplied);

          setJob({
            ...data,
            dateApplied,
            details: {
              address: data.details?.address || '',
              contact: data.details?.contact || '',
              duties: data.details?.duties || '',
              requirements: data.details?.requirements || '',
            },
          });
        } catch (err) {
          const apiError = err as ApiError;
          showError(apiError.message || TOAST_MESSAGES.JOB_FETCH_FAILED);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    } else {
      setJob(getInitialJob(userId));
    }
  }, [id, isNew, userId, navigate, showError]);

  /**
   * Handle form input changes
   */
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('details.')) {
      const detailKey = name.split('.')[1] as keyof Job['details'];
      setJob((prev) => ({
        ...prev,
        details: { ...prev.details, [detailKey]: value },
      }));
    } else {
      setJob((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Handle form submission for creating or updating a job
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      showError(TOAST_MESSAGES.USER_NOT_AUTHENTICATED);
      navigate(ROUTES.LOGIN);
      return;
    }

    setLoading(true);

    try {
      const payload = { ...job, userId };

      if (isNew) {
        const data = await jobApi.createJob(payload);
        showSuccess(TOAST_MESSAGES.JOB_ADDED_SUCCESS);
        setJob(data);
      } else {
        const data = await jobApi.updateJob(id!, payload);
        showSuccess(TOAST_MESSAGES.JOB_UPDATED_SUCCESS);
        setJob(data);
      }

      setEditMode(false);
      setTimeout(() => navigate(ROUTES.HOME), 1000);
    } catch (err) {
      const apiError = err as ApiError;
      showError(`${TOAST_MESSAGES.JOB_SAVE_FAILED}: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  }, [userId, job, isNew, id, navigate, showSuccess, showError]);

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
              <option value={JOB_STATUS.APPLIED}>{JOB_STATUS.APPLIED}</option>
              <option value={JOB_STATUS.INTERVIEWED}>{JOB_STATUS.INTERVIEWED}</option>
              <option value={JOB_STATUS.REJECTED}>{JOB_STATUS.REJECTED}</option>
            </Select>

            <Input
              label="Date Applied"
              type="datetime-local"
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
                    onClick={() => navigate(ROUTES.HOME)}
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default JobPage;
