/**
 * User Service
 * Handles user profile-related API calls
 */

import { apiClient } from '../../api/client';
import type { UserProfileResponse } from '../../types';
import { createApiError } from '../../utils/errorUtils';
import type { IUserService } from '../interfaces';
import type { UpdateUsernamePayload, UpdateEmailPayload } from '../types';

export class UserService implements IUserService {
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>('/user/profile');
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async updateUsername(payload: UpdateUsernamePayload): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.patch<UserProfileResponse>('/user/profile/username', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }

  async updateEmail(payload: UpdateEmailPayload): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.patch<UserProfileResponse>('/user/profile/email', payload);
      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }
}

export const userService = new UserService();
