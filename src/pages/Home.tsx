// src/pages/Home.tsx
import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import styles from './Home.module.css';

interface Job {
  id: number;
  userId: number;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
  details: {
    address?: string;
    contact?: string;
    duties?: string;
    requirements?: string;
  };
}

const statusColors: Record<Job['status'], string> = {
  Applied: styles.applied,
  Interviewed: styles.interviewed,
  Rejected: styles.rejected,
};

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || 'desc';

  useEffect(() => {
    const fetchJobs = async () => {
      if (!userId) {
        setToast({ message: 'Please log in to view jobs', type: 'error' });
        return;
      }
      try {
        console.log('Fetching jobs for userId:', userId);
        const res = await axios.get<Job[]>(`http://localhost:3001/jobs?userId=${userId}`);
        console.log('Fetched jobs:', res.data);
        setJobs(res.data);
      } catch (err) {
        setToast({ message: 'Failed to fetch jobs', type: 'error' });
        //console.error('Fetch error:', err.response?.data || err.message);
      }
    };
    fetchJobs();
  }, [userId]);

  useEffect(() => {
    let temp = [...jobs];
    if (search) {
      temp = temp.filter(j => j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter) {
      temp = temp.filter(j => j.status === filter);
    }
    temp.sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredJobs(temp);
  }, [jobs, search, filter, sort]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
      setToast({ message: 'Job deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete job', type: 'error' });
    }
  };

  const updateSearchParams = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value === '') {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <h1 className={styles.title}>Your Job Applications</h1>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by company or role"
            value={search}
            onChange={(e) => updateSearchParams('search', e.target.value)}
            className={styles.input}
          />
          <select
            value={filter}
            onChange={(e) => updateSearchParams('filter', e.target.value)}
            className={styles.select}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={sort}
            onChange={(e) => updateSearchParams('sort', e.target.value)}
            className={styles.select}
          >
            <option value="desc">Sort by Date Desc</option>
            <option value="asc">Sort by Date Asc</option>
          </select>
          <Link to="/job/new" className={styles.addButton}>
            Add New Job
          </Link>
        </div>
        <div className={styles.grid}>
          {filteredJobs.map(job => (
            <div key={job.id} className={`${styles.card} ${statusColors[job.status]}`}>
              <h2 className={styles.cardTitle}>{job.company} - {job.role}</h2>
              <p className={styles.cardText}>Status: {job.status}</p>
              <p className={styles.cardText}>Date Applied: {job.dateApplied}</p>
              <div className={styles.cardActions}>
                <Link to={`/job/${job.id}?edit=true`} className={styles.cardLink}>
                  Edit
                </Link>
                <Link to={`/job/${job.id}`} className={styles.cardLink}>
                  Details
                </Link>
                <button onClick={() => handleDelete(job.id)} className={styles.cardButton}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredJobs.length === 0 && (
          <p className={styles.noJobs}>No jobs found.</p>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;