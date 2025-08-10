// src/pages/JobPage.tsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

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
  const [job, setJob] = useState<Job>(initialJob);
  const [editMode, setEditMode] = useState(isNew);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = auth?.user?.id;

  useEffect(() => {
    if (!isNew && id) {
      const fetchJob = async () => {
        const res = await axios.get(`http://localhost:3001/jobs/${id}`);
        const jobData = res.data as Job;
        if (jobData.userId !== userId) {
          navigate('/home');
          return;
        }
        setJob(jobData);
      };
      fetchJob();
    } else {
      setJob({ ...initialJob, userId: userId || 0 });
    }
  }, [id, isNew, userId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('details.')) {
      const detailKey = name.split('.')[1];
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
    try {
      if (isNew) {
        await axios.post('http://localhost:3001/jobs', job);
      } else {
        await axios.put(`http://localhost:3001/jobs/${id}`, job);
      }
      navigate('/home');
    } catch (err) {
      console.error('Error saving job');
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{isNew ? 'Add New Job' : 'Job Details'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
        <input
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
          required
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="role"
          placeholder="Role"
          value={job.role}
          onChange={handleChange}
          required
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <select
          name="status"
          value={job.status}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        >
          <option>Applied</option>
          <option>Interviewed</option>
          <option>Rejected</option>
        </select>
        <input
          type="date"
          name="dateApplied"
          value={job.dateApplied}
          onChange={handleChange}
          required
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="details.address"
          placeholder="Company Address"
          value={job.details.address}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          name="details.contact"
          placeholder="Contact Details"
          value={job.details.contact}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          name="details.duties"
          placeholder="Job Duties"
          value={job.details.duties}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          name="details.requirements"
          placeholder="Requirements"
          value={job.details.requirements}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full mb-4 p-2 border rounded"
        />
        {editMode ? (
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
            {isNew ? 'Add' : 'Update'}
          </button>
        ) : (
          <button type="button" onClick={() => setEditMode(true)} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700">
            Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default JobPage;