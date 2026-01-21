import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../../src/contexts';
import { useAuth } from '../../../src/contexts';
import { tokenManager } from '../../../src/contexts/auth';
import { welcomeManager } from '../../../src/contexts/auth';
import { authService, userService } from '../../../src/services';

vi.mock('../../../src/contexts/auth/TokenManager', () => ({
  tokenManager: {
    hasAccessToken: vi.fn(),
    hasAnonToken: vi.fn(),
    getAnonId: vi.fn(),
    setAnonymousTokens: vi.fn(),
    setAccessTokens: vi.fn(),
    clearAccessTokens: vi.fn(),
    clearAnonymousTokens: vi.fn(),
    getRefreshToken: vi.fn(),
  },
}));

vi.mock('../../../src/contexts/auth/WelcomeManager', () => ({
  welcomeManager: {
    isWelcomeShown: vi.fn(),
    markWelcomeShown: vi.fn(),
    shouldShowWelcome: vi.fn(),
  },
}));

vi.mock('../../../src/services', () => ({
  authService: {
    createAnonymous: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    verify: vi.fn(),
    resendCode: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
  userService: {
    getProfile: vi.fn(),
    updateUsername: vi.fn(),
    updateEmail: vi.fn(),
  },
}));

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="status">{auth.status}</div>
      <div data-testid="user">{auth.user ? auth.user.username : 'null'}</div>
      <div data-testid="anonId">{auth.anonId || 'null'}</div>
      <div data-testid="showWelcome">{auth.showWelcome ? 'true' : 'false'}</div>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Bootstrap', () => {
    it('initializes with authenticated status when has access token', async () => {
      vi.mocked(tokenManager.hasAccessToken).mockReturnValue(true);
      vi.mocked(tokenManager.hasAnonToken).mockReturnValue(false);
      vi.mocked(tokenManager.getAnonId).mockReturnValue(null);
      vi.mocked(userService.getProfile).mockResolvedValue({
        code: 'SUCCESS',
        message: 'Profile retrieved',
        data: {
          user_id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          created_at: '2024-01-01',
          timezone: 'UTC',
        },
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
      });

      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    it('initializes with anonymous status when has anon token', async () => {
      vi.mocked(tokenManager.hasAccessToken).mockReturnValue(false);
      vi.mocked(tokenManager.hasAnonToken).mockReturnValue(true);
      vi.mocked(tokenManager.getAnonId).mockReturnValue('anon-123');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('anonymous');
      });
    });

    it('shows welcome screen when no tokens and welcome not shown', async () => {
      vi.mocked(tokenManager.hasAccessToken).mockReturnValue(false);
      vi.mocked(tokenManager.hasAnonToken).mockReturnValue(false);
      vi.mocked(tokenManager.getAnonId).mockReturnValue(null);
      vi.mocked(welcomeManager.shouldShowWelcome).mockReturnValue(true);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('welcome');
      });

      expect(screen.getByTestId('showWelcome')).toHaveTextContent('true');
    });

    it('creates anonymous user when no tokens and welcome already shown', async () => {
      vi.mocked(tokenManager.hasAccessToken).mockReturnValue(false);
      vi.mocked(tokenManager.hasAnonToken).mockReturnValue(false);
      vi.mocked(tokenManager.getAnonId).mockReturnValue(null);
      vi.mocked(welcomeManager.shouldShowWelcome).mockReturnValue(false);
      vi.mocked(authService.createAnonymous).mockResolvedValue({
        anon_id: 'anon-123',
        anon_token: 'anon-token-123',
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('anonymous');
      });

      expect(authService.createAnonymous).toHaveBeenCalled();
      expect(tokenManager.setAnonymousTokens).toHaveBeenCalledWith('anon-123', 'anon-token-123');
    });

    it('handles profile loading failure gracefully', async () => {
      vi.mocked(tokenManager.hasAccessToken).mockReturnValue(true);
      vi.mocked(tokenManager.hasAnonToken).mockReturnValue(false);
      vi.mocked(tokenManager.getAnonId).mockReturnValue(null);
      vi.mocked(welcomeManager.shouldShowWelcome).mockReturnValue(false);
      vi.mocked(userService.getProfile).mockRejectedValue(new Error('Network error'));
      vi.mocked(authService.createAnonymous).mockResolvedValue({
        anon_id: 'anon-123',
        anon_token: 'anon-token-123',
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('anonymous');
      });

      expect(tokenManager.clearAccessTokens).toHaveBeenCalled();
    });
  });
});
