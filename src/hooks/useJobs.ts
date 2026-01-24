// src/hooks/useJobs.ts
import { useState, useEffect, useCallback } from 'react';
import { jobApi } from '../services/api';
import type { Job, ApiError } from '../types';
import { TOAST_MESSAGES } from '../config/constants';

/**
 * Custom hook for managing jobs data
 */
export const useJobs = (userId: string | number | undefined) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all jobs for the current user
   */
  const fetchJobs = useCallback(async () => {
    if (!userId) {
      setError(TOAST_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await jobApi.getJobsByUserId(userId);
      setJobs(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || TOAST_MESSAGES.JOB_FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Delete a job
   */
  const deleteJob = useCallback(async (jobId: string | number): Promise<boolean> => {
    try {
      await jobApi.deleteJob(jobId);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || TOAST_MESSAGES.JOB_DELETE_FAILED);
      return false;
    }
  }, []);

  /**
   * Add a new job to the local state
   */
  const addJob = useCallback((job: Job) => {
    setJobs((prevJobs) => [...prevJobs, job]);
  }, []);

  /**
   * Update a job in the local state
   */
  const updateJob = useCallback((jobId: string | number, updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === jobId ? updatedJob : job))
    );
  }, []);

  /**
   * Fetch jobs on mount or when userId changes
   */
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    deleteJob,
    addJob,
    updateJob,
  };
};
