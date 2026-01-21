import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../../src/contexts/auth/useAuth';
import { AuthProvider } from '../../../src/contexts/auth/AuthProvider';
import { tokenManager } from '../../../src/contexts/auth/TokenManager';

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
    isWelcomeShown: vi.fn().mockReturnValue(true),
    markWelcomeShown: vi.fn(),
    shouldShowWelcome: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('../../../src/services/AuthService', () => ({
  authService: {
    createAnonymous: vi.fn().mockResolvedValue({
      anon_id: 'anon-123',
      anon_token: 'anon-token-123',
    }),
    login: vi.fn(),
    register: vi.fn(),
    verify: vi.fn(),
    resendCode: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('../../../src/services/UserService', () => ({
  userService: {
    getProfile: vi.fn(),
    updateUsername: vi.fn(),
    updateEmail: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tokenManager.hasAccessToken).mockReturnValue(false);
    vi.mocked(tokenManager.hasAnonToken).mockReturnValue(false);
    vi.mocked(tokenManager.getAnonId).mockReturnValue(null);
  });

  it('throws error when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('returns auth context when used within AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('status');
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('register');
  });

  it('provides all required methods', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.verify).toBe('function');
    expect(typeof result.current.resendCode).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.refresh).toBe('function');
    expect(typeof result.current.createAnonymous).toBe('function');
    expect(typeof result.current.reloadProfile).toBe('function');
    expect(typeof result.current.updateUsername).toBe('function');
    expect(typeof result.current.updateEmail).toBe('function');
    expect(typeof result.current.dismissWelcome).toBe('function');
    expect(typeof result.current.showWelcomeScreen).toBe('function');
  });
});
