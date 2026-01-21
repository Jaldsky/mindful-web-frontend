import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../../src/services/user/UserService';
import { apiClient } from '../../../src/api/client';
import { ApiError } from '../../../src/utils/errorUtils';
import type { UserProfileResponse } from '../../../src/types';

vi.mock('../../../src/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    const mockResponse: UserProfileResponse = {
      data: {
        user_id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        is_anonymous: false,
      },
    };

    it('should fetch user profile successfully', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await service.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/user/profile');
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on fetch failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Unauthorized',
            message: 'Invalid token',
          },
          status: 401,
        },
      };
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(service.getProfile()).rejects.toThrow(ApiError);
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(service.getProfile()).rejects.toThrow();
    });
  });

  describe('updateUsername', () => {
    const mockResponse: UserProfileResponse = {
      data: {
        user_id: 'user-123',
        username: 'newusername',
        email: 'test@example.com',
        is_anonymous: false,
      },
    };

    it('should update username successfully', async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({ data: mockResponse });

      const result = await service.updateUsername({
        username: 'newusername',
      });

      expect(apiClient.patch).toHaveBeenCalledWith('/user/profile/username', {
        username: 'newusername',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on update failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Conflict',
            message: 'Username already taken',
          },
          status: 409,
        },
      };
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(
        service.updateUsername({
          username: 'existinguser',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle validation errors', async () => {
      const mockError = {
        response: {
          data: {
            error: 'BadRequest',
            message: 'Username is too short',
          },
          status: 400,
        },
      };
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(
        service.updateUsername({
          username: 'ab',
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('updateEmail', () => {
    const mockResponse: UserProfileResponse = {
      data: {
        user_id: 'user-123',
        username: 'testuser',
        email: 'newemail@example.com',
        is_anonymous: false,
      },
    };

    it('should update email successfully', async () => {
      vi.mocked(apiClient.patch).mockResolvedValue({ data: mockResponse });

      const result = await service.updateEmail({
        email: 'newemail@example.com',
      });

      expect(apiClient.patch).toHaveBeenCalledWith('/user/profile/email', {
        email: 'newemail@example.com',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on update failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Conflict',
            message: 'Email already in use',
          },
          status: 409,
        },
      };
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(
        service.updateEmail({
          email: 'existing@example.com',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle validation errors', async () => {
      const mockError = {
        response: {
          data: {
            error: 'BadRequest',
            message: 'Invalid email format',
          },
          status: 400,
        },
      };
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(
        service.updateEmail({
          email: 'invalid-email',
        })
      ).rejects.toThrow(ApiError);
    });

    it('should handle unauthorized access', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Unauthorized',
            message: 'Authentication required',
          },
          status: 401,
        },
      };
      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(
        service.updateEmail({
          email: 'newemail@example.com',
        })
      ).rejects.toThrow(ApiError);
    });
  });
});
