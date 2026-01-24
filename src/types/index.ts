// src/types/index.ts

/**
 * User related types
 */
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Job related types
 */
export interface JobDetails {
  address?: string;
  contact?: string;
  duties?: string;
  requirements?: string;
}

export interface Job {
  id?: number | string;
  userId: number | string;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
  details: JobDetails;
}

export type JobStatus = Job['status'];

/**
 * Toast/Notification types
 */
export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Card variant types
 */
export type CardVariant = 'default' | 'applied' | 'interviewed' | 'rejected';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Statistics types
 */
export interface JobStatistics {
  total: number;
  applied: number;
  interviewed: number;
  rejected: number;
}

/**
 * API Response types
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
