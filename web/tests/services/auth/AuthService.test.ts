import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../../src/services';
import { apiClient } from '../../../src/api/client';
import type {
  AuthLoginResponse,
  AuthRegisterResponse,
  AuthVerifyResponse,
  AuthResendCodeResponse,
  AuthRefreshResponse,
  AuthLogoutResponse,
  AuthAnonymousResponse,
} from '../../../src/types';

vi.mock('../../../src/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  describe('login', () => {
    const mockResponse: AuthLoginResponse = {
      access_token: 'access-token-123',
      refresh_token: 'refresh-token-456',
    };

    it('should login successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on login failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Unauthorized',
            message: 'Invalid credentials',
          },
          status: 401,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(
        service.login({
          username: 'testuser',
          password: 'wrong-password',
        })
      ).rejects.toThrow();
    });
  });

  describe('register', () => {
    const mockResponse: AuthRegisterResponse = {
      code: 'REGISTER_SUCCESS',
      message: 'Registration successful',
    };

    it('should register successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.register({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on registration failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Conflict',
            message: 'Username already exists',
          },
          status: 409,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(
        service.register({
          username: 'existinguser',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('verify', () => {
    const mockResponse: AuthVerifyResponse = {
      code: 'VERIFY_SUCCESS',
      message: 'Email verified successfully',
    };

    it('should verify email successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.verify({
        email: 'user@example.com',
        code: '123456',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/verify', {
        email: 'user@example.com',
        code: '123456',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on verification failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'BadRequest',
            message: 'Invalid verification code',
          },
          status: 400,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(
        service.verify({
          email: 'user@example.com',
          code: 'invalid',
        })
      ).rejects.toThrow();
    });
  });

  describe('resendCode', () => {
    const mockResponse: AuthResendCodeResponse = {
      code: 'RESEND_SUCCESS',
      message: 'Verification code sent',
    };

    it('should resend verification code successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.resendCode({
        email: 'user@example.com',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/resend-code', {
        email: 'user@example.com',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on resend failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'NotFound',
            message: 'Email not found',
          },
          status: 404,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(
        service.resendCode({
          email: 'notfound@example.com',
        })
      ).rejects.toThrow();
    });
  });

  describe('refresh', () => {
    const mockResponse: AuthRefreshResponse = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
    };

    it('should refresh tokens successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.refresh({
        refresh_token: 'old-refresh-token',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refresh_token: 'old-refresh-token',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should work with default empty payload', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      await service.refresh();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {});
    });

    it('should throw ApiError on refresh failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Unauthorized',
            message: 'Invalid refresh token',
          },
          status: 401,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(
        service.refresh({
          refresh_token: 'invalid-token',
        })
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    const mockResponse: AuthLogoutResponse = {
      code: 'LOGOUT_SUCCESS',
      message: 'Logged out successfully',
    };

    it('should logout successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on logout failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'InternalServerError',
            message: 'Logout failed',
          },
          status: 500,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(service.logout()).rejects.toThrow();
    });
  });

  describe('createAnonymous', () => {
    const mockResponse: AuthAnonymousResponse = {
      anon_id: 'anon-123',
    };

    it('should create anonymous user successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

      const result = await service.createAnonymous();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/anonymous');
      expect(result).toEqual(mockResponse);
    });

    it('should throw ApiError on anonymous creation failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'InternalServerError',
            message: 'Failed to create anonymous user',
          },
          status: 500,
        },
      };
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(service.createAnonymous()).rejects.toThrow();
    });
  });
});
