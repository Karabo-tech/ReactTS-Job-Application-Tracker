// src/hooks/useToast.ts
import { useState, useCallback } from 'react';
import type { ToastMessage } from '../types';
import { ANIMATION } from '../config/constants';

/**
 * Custom hook for managing toast notifications
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  /**
   * Show a toast message
   */
  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    setToast({ message, type });
  }, []);

  /**
   * Show a success toast
   */
  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success');
  }, [showToast]);

  /**
   * Show an error toast
   */
  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  /**
   * Hide the current toast
   */
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  /**
   * Show a toast for a specific duration
   */
  const showToastWithDuration = useCallback((
    message: string,
    type: ToastMessage['type'] = 'info',
    duration: number = ANIMATION.TOAST_DURATION
  ) => {
    showToast(message, type);
    setTimeout(() => {
      hideToast();
    }, duration);
  }, [showToast, hideToast]);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    hideToast,
    showToastWithDuration,
  };
};
