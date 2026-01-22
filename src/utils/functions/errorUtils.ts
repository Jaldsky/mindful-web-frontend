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
      const status = axiosError.response.status;
      const data = axiosError.response.data as { message?: string; detail?: unknown };
      
      let message = `Error ${status}: ${data?.message || axiosError.response.statusText}`;
      
      if (data?.detail) {
        const detailStr = typeof data.detail === 'string' 
          ? data.detail 
          : JSON.stringify(data.detail);
        message += ` - ${detailStr}`;
      }
      
      return message;
    }
    
    if (axiosError.request) {
      return 'No response from server. Is the backend running on http://localhost:8000?';
    }
  }
  
  if (error instanceof Error) {
    return `Request error: ${error.message}`;
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