/**
 * Service Interfaces
 * Defines contracts for all service classes
 */

import type {
  AnalyticsUsageResponse,
  AuthAnonymousResponse,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthResendCodeResponse,
  AuthVerifyResponse,
  UserProfileResponse,
} from '../types';

import type {
  AnalyticsRequestParams,
  LoginPayload,
  RegisterPayload,
  VerifyPayload,
  ResendCodePayload,
  RefreshPayload,
  UpdateUsernamePayload,
  UpdateEmailPayload,
} from './types';

export interface IAnalyticsService {
  /**
   * Fetches usage analytics for a given date range
   * @param params - Request parameters (from, to, page)
   * @returns Promise with analytics data
   * @throws ApiError if request fails
   */
  getUsage(params: AnalyticsRequestParams): Promise<AnalyticsUsageResponse>;
}

export interface IAuthService {
  /**
   * Login user with username and password
   * @param payload - Login credentials
   * @returns Promise with authentication tokens
   * @throws ApiError if login fails
   */
  login(payload: LoginPayload): Promise<AuthLoginResponse>;

  /**
   * Register new user
   * @param payload - Registration data
   * @returns Promise with registration result
   * @throws ApiError if registration fails
   */
  register(payload: RegisterPayload): Promise<AuthRegisterResponse>;

  /**
   * Verify email with code
   * @param payload - Verification data
   * @returns Promise with verification result
   * @throws ApiError if verification fails
   */
  verify(payload: VerifyPayload): Promise<AuthVerifyResponse>;

  /**
   * Resend verification code
   * @param payload - Email to resend code to
   * @returns Promise with resend result
   * @throws ApiError if resend fails
   */
  resendCode(payload: ResendCodePayload): Promise<AuthResendCodeResponse>;

  /**
   * Refresh authentication token
   * @param payload - Optional refresh token
   * @returns Promise with new tokens
   * @throws ApiError if refresh fails
   */
  refresh(payload?: RefreshPayload): Promise<AuthRefreshResponse>;

  /**
   * Logout user
   * @returns Promise with logout result
   * @throws ApiError if logout fails
   */
  logout(): Promise<AuthLogoutResponse>;

  /**
   * Create anonymous user
   * @returns Promise with anonymous user data
   * @throws ApiError if creation fails
   */
  createAnonymous(): Promise<AuthAnonymousResponse>;
}

export interface IUserService {
  /**
   * Get user profile
   * @returns Promise with user profile data
   * @throws ApiError if request fails
   */
  getProfile(): Promise<UserProfileResponse>;

  /**
   * Update user username
   * @param payload - New username
   * @returns Promise with updated profile
   * @throws ApiError if update fails
   */
  updateUsername(payload: UpdateUsernamePayload): Promise<UserProfileResponse>;

  /**
   * Update user email
   * @param payload - New email
   * @returns Promise with updated profile
   * @throws ApiError if update fails
   */
  updateEmail(payload: UpdateEmailPayload): Promise<UserProfileResponse>;
}
