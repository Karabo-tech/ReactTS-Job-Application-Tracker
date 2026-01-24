// src/config/constants.ts

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    USERS: '/users',
    JOBS: '/jobs',
  },
  TIMEOUT: 10000,
} as const;

/**
 * Application Routes
 */
export const ROUTES = {
  HOME: '/home',
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  JOB_NEW: '/job/new',
  JOB_DETAIL: (id: string | number) => `/job/${id}`,
  JOB_EDIT: (id: string | number) => `/job/${id}?edit=true`,
} as const;

/**
 * Job Status Types
 */
export const JOB_STATUS = {
  APPLIED: 'Applied',
  INTERVIEWED: 'Interviewed',
  REJECTED: 'Rejected',
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];

/**
 * Toast Messages
 */
export const TOAST_MESSAGES = {
  // Auth
  LOGIN_REQUIRED: 'Please log in to view jobs',
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  REGISTER_SUCCESS: 'Registration successful',
  REGISTER_FAILED: 'Registration failed. Please try again.',
  UNAUTHORIZED: 'Unauthorized access',
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  
  // Jobs
  JOB_FETCH_FAILED: 'Failed to fetch jobs',
  JOB_ADDED_SUCCESS: 'Job added successfully',
  JOB_UPDATED_SUCCESS: 'Job updated successfully',
  JOB_DELETED_SUCCESS: 'Job deleted successfully',
  JOB_SAVE_FAILED: 'Failed to save job',
  JOB_DELETE_FAILED: 'Failed to delete job',
  
  // General
  NO_JOBS_FOUND: 'No jobs found.',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'authToken',
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
} as const;

/**
 * Animation Durations (in ms)
 */
export const ANIMATION = {
  TOAST_DURATION: 3000,
  REDIRECT_DELAY: 1000,
  DEBOUNCE_DELAY: 300,
} as const;

/**
 * Date/Time Formats
 */
export const DATE_FORMATS = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
} as const;
