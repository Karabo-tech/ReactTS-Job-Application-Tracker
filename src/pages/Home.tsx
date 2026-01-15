// src/pages/Home.tsx
import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Select, Card, Container } from '../components';
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

  const getCardVariant = (status: Job['status']) => {
    const variantMap: Record<Job['status'], 'applied' | 'interviewed' | 'rejected'> = {
      Applied: 'applied',
      Interviewed: 'interviewed',
      Rejected: 'rejected',
    };
    return variantMap[status];
  };

  return (
    <div className={styles.home}>
      <Container>
        <h1 className={styles.title}>Your Job Applications</h1>
        <div className={styles.filters}>
          <Input
            type="text"
            placeholder="Search by company or role"
            value={search}
            onChange={(e) => updateSearchParams('search', e.target.value)}
            fullWidth
          />
          <Select
            value={filter}
            onChange={(e) => updateSearchParams('filter', e.target.value)}
            fullWidth
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Rejected">Rejected</option>
          </Select>
          <Select
            value={sort}
            onChange={(e) => updateSearchParams('sort', e.target.value)}
            fullWidth
          >
            <option value="desc">Sort by Date (Newest)</option>
            <option value="asc">Sort by Date (Oldest)</option>
          </Select>
          <Link to="/job/new">
            <Button variant="primary" size="md" fullWidth>
              + Add New Job
            </Button>
          </Link>
        </div>
        <div className={styles.grid}>
          {filteredJobs.map(job => (
            <Card key={job.id} variant={getCardVariant(job.status)} hoverable>
              <h2 className={styles.cardTitle}>{job.company}</h2>
              <h3 className={styles.cardSubtitle}>{job.role}</h3>
              <div className={styles.cardInfo}>
                <span className={styles.cardStatus}>{job.status}</span>
                <span className={styles.cardDate}>{new Date(job.dateApplied).toLocaleDateString()}</span>
              </div>
              <div className={styles.cardActions}>
                <Link to={`/job/${job.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
                <Link to={`/job/${job.id}?edit=true`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button onClick={() => handleDelete(job.id)} variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {filteredJobs.length === 0 && (
          <div className={styles.noJobs}>
            <p>No jobs found.</p>
            <Link to="/job/new">
              <Button variant="primary" size="lg">
                Add Your First Job
              </Button>
            </Link>
          </div>
        )}
      </Container>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Home;