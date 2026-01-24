// src/utils/helpers.ts
import type { Job, JobStatistics, CardVariant, JobStatus } from '../types';

/**
 * Calculate job statistics from an array of jobs
 */
export const calculateJobStats = (jobs: Job[]): JobStatistics => {
  return {
    total: jobs.length,
    applied: jobs.filter((job) => job.status === 'Applied').length,
    interviewed: jobs.filter((job) => job.status === 'Interviewed').length,
    rejected: jobs.filter((job) => job.status === 'Rejected').length,
  };
};

/**
 * Get card variant based on job status
 */
export const getCardVariantFromStatus = (status: JobStatus): CardVariant => {
  const variantMap: Record<JobStatus, CardVariant> = {
    Applied: 'applied',
    Interviewed: 'interviewed',
    Rejected: 'rejected',
  };
  return variantMap[status];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

/**
 * Format date for datetime-local input
 */
export const formatDateTimeLocal = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().slice(0, 16);
};

/**
 * Check if a date string is in date-only format (YYYY-MM-DD)
 */
export const isDateOnlyFormat = (dateString: string): boolean => {
  return dateString.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

/**
 * Convert date-only format to datetime-local format
 */
export const convertToDateTimeLocal = (dateString: string): string => {
  if (isDateOnlyFormat(dateString)) {
    return `${dateString}T00:00`;
  }
  return dateString;
};

/**
 * Debounce function for search/filter operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * Filter jobs based on search query
 */
export const filterJobsBySearch = (jobs: Job[], searchQuery: string): Job[] => {
  if (!searchQuery) return jobs;
  
  const query = searchQuery.toLowerCase();
  return jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query)
  );
};

/**
 * Filter jobs by status
 */
export const filterJobsByStatus = (jobs: Job[], status: JobStatus | ''): Job[] => {
  if (!status) return jobs;
  return jobs.filter((job) => job.status === status);
};

/**
 * Sort jobs by date
 */
export const sortJobsByDate = (jobs: Job[], order: 'asc' | 'desc'): Job[] => {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.dateApplied).getTime();
    const dateB = new Date(b.dateApplied).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};
