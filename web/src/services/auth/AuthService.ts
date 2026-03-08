/**
 * Authentication Service
 * Handles auth-related API calls
 */

import { apiClient } from '../../api/client';
import { API_CONFIG } from '../../constants';
import type {
  AuthAnonymousResponse,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthResendCodeResponse,
  AuthSessionResponse,
  AuthVerifyResponse,
} from '../../types';
import { createApiError } from '../../utils';
import type { IAuthService } from '../interfaces';
import type {
  LoginPayload,
  RegisterPayload,
  VerifyPayload,
  ResendCodePayload,
  RefreshPayload,
  OAuthLoginPayload,
} from '../types';

export class AuthService implements IAuthService {
  async login(payload: LoginPayload): Promise<AuthLoginResponse> {
    try {
      const response = await apiClient.post<AuthLoginResponse>('/auth/login', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async register(payload: RegisterPayload): Promise<AuthRegisterResponse> {
    try {
      const response = await apiClient.post<AuthRegisterResponse>('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async verify(payload: VerifyPayload): Promise<AuthVerifyResponse> {
    try {
      const response = await apiClient.post<AuthVerifyResponse>('/auth/verify', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async resendCode(payload: ResendCodePayload): Promise<AuthResendCodeResponse> {
    try {
      const response = await apiClient.post<AuthResendCodeResponse>('/auth/resend-code', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async refresh(payload: RefreshPayload = {}): Promise<AuthRefreshResponse> {
    try {
      const response = await apiClient.post<AuthRefreshResponse>('/auth/refresh', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async oauthLogin(provider: string, payload: OAuthLoginPayload): Promise<AuthLoginResponse> {
    try {
      const normalizedProvider = (provider || '').trim().toLowerCase();
      const response = await apiClient.post<AuthLoginResponse>(`/auth/oauth/${normalizedProvider}/callback`, payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  getOAuthStartUrl(provider: string): string {
    const normalizedProvider = (provider || '').trim().toLowerCase();
    const base = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
    return `${base}/auth/oauth/${normalizedProvider}/authorize`;
  }

  async logout(): Promise<AuthLogoutResponse> {
    try {
      const response = await apiClient.post<AuthLogoutResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async createAnonymous(): Promise<AuthAnonymousResponse> {
    try {
      const response = await apiClient.post<AuthAnonymousResponse>('/auth/anonymous');
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async getSession(): Promise<AuthSessionResponse> {
    try {
      const response = await apiClient.get<AuthSessionResponse>('/auth/session');
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }
}

export const authService = new AuthService();
