// src/pages/Home.tsx
import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import { Toast, Button, Input, Select, Container, JobCard, StatCard } from '../components';
import { useJobs } from '../hooks/useJobs';
import { useToast } from '../hooks/useToast';
import { 
  calculateJobStats, 
  filterJobsBySearch,
  filterJobsByStatus,
  sortJobsByDate,
} from '../utils/helpers';
import { ROUTES, TOAST_MESSAGES } from '../config/constants';
import type { Job } from '../types';
import styles from './Home.module.css';

/**
 * Home Component
 * Displays the user's job applications with filtering, searching, and sorting capabilities
 */
const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;

  // Get URL search parameters
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || 'desc';

  // Use custom hooks
  const { jobs, loading, error: jobsError, deleteJob: deleteJobApi } = useJobs(userId);
  const { toast, showSuccess, showError, hideToast } = useToast();

  /**
   * Show error toast when jobs fail to load
   */
  useEffect(() => {
    if (jobsError) {
      showError(jobsError);
    }
  }, [jobsError, showError]);

  /**
   * Update URL search parameters
   */
  const updateSearchParams = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      if (value === '') {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  }, [setSearchParams]);

  /**
   * Handle job deletion
   */
  const handleDelete = useCallback(async (id: number | string) => {
    const success = await deleteJobApi(id);
    if (success) {
      showSuccess(TOAST_MESSAGES.JOB_DELETED_SUCCESS);
    } else {
      showError(TOAST_MESSAGES.JOB_DELETE_FAILED);
    }
  }, [deleteJobApi, showSuccess, showError]);

  /**
   * Filter and sort jobs based on search parameters
   */
  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    
    // Apply search filter
    result = filterJobsBySearch(result, search);
    
    // Apply status filter
    result = filterJobsByStatus(result, filter as Job['status'] | '');
    
    // Apply sorting
    result = sortJobsByDate(result, sort as 'asc' | 'desc');
    
    return result;
  }, [jobs, search, filter, sort]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => calculateJobStats(jobs), [jobs]);

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <Container>
          <h1 className={styles.title}>Your Job Applications</h1>
          <p className={styles.subtitle}>Track and manage all your job applications in one place</p>
        </Container>
      </div>
      <div className={styles.content}>
        <Container>
          <div className={styles.stats}>
            <StatCard value={stats.total} label="Total Applications" type="total" />
            <StatCard value={stats.applied} label="Applied" type="applied" />
            <StatCard value={stats.interviewed} label="Interviewed" type="interviewed" />
            <StatCard value={stats.rejected} label="Rejected" type="rejected" />
          </div>
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
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
        {filteredJobs.length === 0 && !loading && (
          <div className={styles.noJobs}>
            <p>{TOAST_MESSAGES.NO_JOBS_FOUND}</p>
            <p className={styles.noJobsSubtext}>Start tracking your job applications by adding your first one!</p>
            <Link to={ROUTES.JOB_NEW}>
              <Button variant="primary" size="lg">
                Add Your First Job
              </Button>
            </Link>
          </div>
        )}
        </Container>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default Home;