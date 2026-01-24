// src/services/api.ts
import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/constants';
import type { Job, User, ApiError } from '../types';

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding auth tokens (if needed in future)
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

/**
 * Job API Service
 */
export const jobApi = {
  /**
   * Get all jobs for a specific user
   */
  getJobsByUserId: async (userId: string | number): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>(
      `${API_CONFIG.ENDPOINTS.JOBS}?userId=${userId}`
    );
    return response.data;
  },

  /**
   * Get a single job by ID
   */
  getJobById: async (jobId: string | number): Promise<Job> => {
    const response = await apiClient.get<Job>(
      `${API_CONFIG.ENDPOINTS.JOBS}/${jobId}`
    );
    return response.data;
  },

  /**
   * Create a new job
   */
  createJob: async (job: Job): Promise<Job> => {
    const response = await apiClient.post<Job>(
      API_CONFIG.ENDPOINTS.JOBS,
      job
    );
    return response.data;
  },

  /**
   * Update an existing job
   */
  updateJob: async (jobId: string | number, job: Job): Promise<Job> => {
    const response = await apiClient.put<Job>(
      `${API_CONFIG.ENDPOINTS.JOBS}/${jobId}`,
      job
    );
    return response.data;
  },

  /**
   * Delete a job
   */
  deleteJob: async (jobId: string | number): Promise<void> => {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.JOBS}/${jobId}`);
  },
};

/**
 * User/Auth API Service
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.USERS,
      userData
    );
    return response.data;
  },

  /**
   * Login user (for demo purposes - in production, use proper auth endpoint)
   */
  login: async (userData: Omit<User, 'id'>): Promise<User> => {
    // Note: This is a simplified login for demo purposes
    // In production, you'd have a proper /login endpoint
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.USERS,
      userData
    );
    return response.data;
  },
};

export default apiClient;
