import { describe, it, expect } from 'vitest';
import { extractErrorMessage, createApiError, isApiError } from '../../../src/utils';

// Helper to create AxiosError-like objects
function createAxiosErrorWithResponse(status: number, data: unknown): Error & { response?: unknown; request?: unknown } {
  const error = new Error('Request failed') as Error & { response?: unknown; request?: unknown };
  error.response = {
    status,
    statusText: 'Error',
    data,
  };
  return error;
}

function createAxiosErrorWithRequest(): Error & { response?: unknown; request?: unknown } {
  const error = new Error('Network error') as Error & { response?: unknown; request?: unknown };
  error.request = {};
  // Explicitly set response to undefined to match AxiosError behavior
  error.response = undefined;
  return error;
}

describe('errorUtils', () => {
  describe('extractErrorMessage', () => {
    it('should extract message from AxiosError with response', () => {
      const error = createAxiosErrorWithResponse(404, {
        message: 'Resource not found',
      });

      const message = extractErrorMessage(error);
      expect(message).toContain('Error 404');
      expect(message).toContain('Resource not found');
    });

    it('should extract message with detail from AxiosError', () => {
      const error = createAxiosErrorWithResponse(400, {
        message: 'Validation error',
        detail: 'Invalid date format',
      });

      const message = extractErrorMessage(error);
      expect(message).toContain('Error 400');
      expect(message).toContain('Validation error');
      expect(message).toContain('Invalid date format');
    });

    it('should extract message with detail as object from AxiosError', () => {
      const error = createAxiosErrorWithResponse(400, {
        message: 'Validation error',
        detail: { field: 'email', reason: 'Invalid format' },
      });

      const message = extractErrorMessage(error);
      expect(message).toContain('Error 400');
      expect(message).toContain('Validation error');
      expect(message).toContain('field');
      expect(message).toContain('email');
    });

    it('should handle AxiosError with request but no response', () => {
      const error = createAxiosErrorWithRequest();

      const message = extractErrorMessage(error);
      expect(message).toContain('No response from server');
    });

    it('should handle generic Error', () => {
      const error = new Error('Something went wrong');
      const message = extractErrorMessage(error);
      expect(message).toBe('Request error: Something went wrong');
    });

    it('should handle unknown error types', () => {
      const error = 'String error';
      const message = extractErrorMessage(error);
      expect(message).toBe('An unexpected error occurred');
    });

    it('should handle null/undefined', () => {
      expect(extractErrorMessage(null)).toBe('An unexpected error occurred');
      expect(extractErrorMessage(undefined)).toBe('An unexpected error occurred');
    });
  });

  describe('createApiError', () => {
    it('should create ApiError from AxiosError with response', () => {
      const error = createAxiosErrorWithResponse(500, {
        message: 'Internal server error',
        details: { code: 'ERR_500' },
      });

      const apiError = createApiError(error);
      
      expect(apiError.message).toContain('Error 500');
      expect(apiError.status).toBe(500);
      expect(apiError.details).toEqual({
        message: 'Internal server error',
        details: { code: 'ERR_500' },
      });
    });

    it('should create ApiError from AxiosError without response', () => {
      const error = createAxiosErrorWithRequest();

      const apiError = createApiError(error);
      
      expect(apiError.message).toContain('No response from server');
      expect(apiError.status).toBeUndefined();
      expect(apiError.details).toBeUndefined();
    });

    it('should create ApiError from generic Error', () => {
      const error = new Error('Generic error');
      const apiError = createApiError(error);
      
      expect(apiError.message).toBe('Request error: Generic error');
      expect(apiError.status).toBeUndefined();
      expect(apiError.details).toBeUndefined();
    });

    it('should create ApiError from unknown error type', () => {
      const apiError = createApiError('String error');
      
      expect(apiError.message).toBe('An unexpected error occurred');
      expect(apiError.status).toBeUndefined();
      expect(apiError.details).toBeUndefined();
    });
  });

  describe('isApiError', () => {
    it('should return true for valid ApiError object', () => {
      const error = {
        message: 'Test error',
        status: 404,
        details: { info: 'test' },
      };

      expect(isApiError(error)).toBe(true);
    });

    it('should return true for ApiError with only message', () => {
      const error = {
        message: 'Test error',
      };

      expect(isApiError(error)).toBe(true);
    });

    it('should return false for null', () => {
      expect(isApiError(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isApiError(undefined)).toBe(false);
    });

    it('should return false for object without message', () => {
      const error = {
        status: 404,
        details: 'test',
      };

      expect(isApiError(error)).toBe(false);
    });

    it('should return false for object with non-string message', () => {
      const error = {
        message: 123,
      };

      expect(isApiError(error)).toBe(false);
    });

    it('should return false for string', () => {
      expect(isApiError('error')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isApiError(404)).toBe(false);
    });

    it('should return false for Error instance', () => {
      const error = new Error('Test error');
      expect(isApiError(error)).toBe(false);
    });
  });
});

