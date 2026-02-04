/**
 * Error handling utilities
 * Following the pattern from the extension plugin
 */

import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Extracts user-friendly error message from API error
 * @param error - Error object (can be AxiosError or generic Error)
 * @returns User-friendly error message
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      const data = axiosError.response.data as { message?: string; detail?: unknown };

      if (typeof data?.message === 'string' && data.message.trim().length > 0) {
        return data.message;
      }

      if (typeof data?.detail === 'string' && data.detail.trim().length > 0) {
        return data.detail;
      }

      return axiosError.response.statusText || `Error ${axiosError.response.status}`;
    }
    
    if (axiosError.request) {
      return 'No response from server. Is the backend running on http://localhost:8000?';
    }
  }
  
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }

  if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }

  return 'An unexpected error occurred';
}

/**
 * Creates standardized API error object
 * @param error - Error object
 * @returns Standardized error object
 */
export function createApiError(error: unknown): ApiError {
  const message = extractErrorMessage(error);
  
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    return {
      message,
      status: axiosError.response?.status,
      details: axiosError.response?.data,
    };
  }
  
  return { message };
}

/**
 * Type guard to check if error is ApiError
 * @param error - Error to check
 * @returns True if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  
  if (error instanceof Error) {
    return false;
  }
  
  const obj = error as Record<string, unknown>;
  return 'message' in obj && typeof obj.message === 'string';
}