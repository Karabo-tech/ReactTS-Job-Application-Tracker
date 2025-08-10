// src/pages/Home.tsx
import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

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
  Applied: 'bg-yellow-200',
  Interviewed: 'bg-green-200',
  Rejected: 'bg-red-200',
};

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || 'desc';

  useEffect(() => {
    const fetchJobs = async () => {
      if (userId) {
        const res = await axios.get<Job[]>(`http://localhost:3001/jobs?userId=${userId}`);
        setJobs(res.data);
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
    await axios.delete(`http://localhost:3001/jobs/${id}`);
    setJobs(jobs.filter(j => j.id !== id));
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
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Job Applications</h1>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by company or role"
          value={search}
          onChange={(e) => updateSearchParams('search', e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filter}
          onChange={(e) => updateSearchParams('filter', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={sort}
          onChange={(e) => updateSearchParams('sort', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="desc">Sort by Date Desc</option>
          <option value="asc">Sort by Date Asc</option>
        </select>
        <Link to="/job/new" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Add New Job</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => (
          <div key={job.id} className={`p-4 rounded shadow-md ${statusColors[job.status]}`}>
            <h2 className="text-xl font-bold">{job.company} - {job.role}</h2>
            <p>Status: {job.status}</p>
            <p>Date Applied: {job.dateApplied}</p>
            <div className="flex space-x-2 mt-2">
              <Link to={`/job/${job.id}`} className="text-blue-500 hover:underline">Details</Link>
              <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredJobs.length === 0 && <p>No jobs found.</p>}
    </div>
  );
};

export default Home;