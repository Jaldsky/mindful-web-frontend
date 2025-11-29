/**
 * API Client
 * Configured axios instance with interceptors
 * Following the pattern from the extension plugin
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: API_CONFIG.TIMEOUT,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - adds User ID header
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const userId = this.getOrCreateUserId();
        if (config.headers) {
          config.headers['X-User-ID'] = userId;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            params: config.params,
          });
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handles errors and logging
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
          });
        }
        return response;
      },
      (error) => {
        // Log error in development
        if (import.meta.env.DEV) {
          console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    }
    return userId;
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient().instance;

