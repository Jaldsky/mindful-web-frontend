/**
 * Tests for Context Hooks
 * All context hooks tests in one place
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth, useTheme, useLocale, useUser } from '../../src/contexts/hooks';
import { AuthProvider } from '../../src/contexts/auth/AuthProvider';
import { ThemeProvider } from '../../src/contexts/theme/ThemeProvider';
import { LocaleProvider } from '../../src/contexts/locale/LocaleProvider';
import { UserProvider } from '../../src/contexts/user/UserProvider';
import { tokenManager } from '../../src/contexts/auth/TokenManager';
import { THEME } from '../../src/constants';

// Mock auth dependencies
vi.mock('../../src/contexts/auth/TokenManager', () => ({
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

vi.mock('../../src/contexts/auth/WelcomeManager', () => ({
  welcomeManager: {
    isWelcomeShown: vi.fn().mockReturnValue(true),
    markWelcomeShown: vi.fn(),
    shouldShowWelcome: vi.fn().mockReturnValue(false),
  },
}));

vi.mock('../../src/services/AuthService', () => ({
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

vi.mock('../../src/services/UserService', () => ({
  userService: {
    getProfile: vi.fn(),
    updateUsername: vi.fn(),
    updateEmail: vi.fn(),
  },
}));

describe('Context Hooks', () => {
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

  describe('useTheme', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      console.error = consoleError;
    });

    it('returns theme context when used inside ThemeProvider', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.theme).toBeDefined();
      expect(result.current.isDark).toBeDefined();
      expect(result.current.setTheme).toBeDefined();
      expect(result.current.toggleTheme).toBeDefined();
    });

    it('returns correct theme value', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(typeof result.current.theme).toBe('string');
      expect([THEME.LIGHT, THEME.DARK]).toContain(result.current.theme);
    });

    it('returns correct isDark value', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(typeof result.current.isDark).toBe('boolean');
    });

    it('setTheme is a function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(typeof result.current.setTheme).toBe('function');
    });

    it('toggleTheme is a function', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('isDark is false for light theme', () => {
      localStorage.setItem('mindful_theme', THEME.LIGHT);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe(THEME.LIGHT);
      expect(result.current.isDark).toBe(false);
    });

    it('isDark is true for dark theme', () => {
      localStorage.setItem('mindful_theme', THEME.DARK);

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe(THEME.DARK);
      expect(result.current.isDark).toBe(true);
    });
  });

  describe('useLocale', () => {
    it('throws error when used outside LocaleProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useLocale());
      }).toThrow('useLocale must be used within a LocaleProvider');

      console.error = consoleError;
    });

    it('returns locale context when used inside LocaleProvider', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: LocaleProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.locale).toBeDefined();
      expect(result.current.setLocale).toBeDefined();
      expect(result.current.detectBrowserLocale).toBeDefined();
    });

    it('returns correct locale value', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: LocaleProvider,
      });

      expect(typeof result.current.locale).toBe('string');
      expect(['en', 'ru']).toContain(result.current.locale);
    });

    it('setLocale is a function', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: LocaleProvider,
      });

      expect(typeof result.current.setLocale).toBe('function');
    });

    it('detectBrowserLocale is a function', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: LocaleProvider,
      });

      expect(typeof result.current.detectBrowserLocale).toBe('function');
    });

    it('detectBrowserLocale returns a valid locale', () => {
      const { result } = renderHook(() => useLocale(), {
        wrapper: LocaleProvider,
      });

      const detectedLocale = result.current.detectBrowserLocale();
      expect(['en', 'ru']).toContain(detectedLocale);
    });
  });

  describe('useUser', () => {
    it('throws error when used outside UserProvider', () => {
      // Suppress console.error for this test
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useUser());
      }).toThrow('useUser must be used within a UserProvider');

      console.error = consoleError;
    });

    it('returns user context when used inside UserProvider', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      expect(result.current).toBeDefined();
      expect(result.current.userId).toBeDefined();
      expect(result.current.setUserId).toBeDefined();
      expect(result.current.generateUserId).toBeDefined();
    });

    it('userId can be string or null', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      const userId = result.current.userId;
      expect(userId === null || typeof userId === 'string').toBe(true);
    });

    it('setUserId is a function', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      expect(typeof result.current.setUserId).toBe('function');
    });

    it('generateUserId is a function', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      expect(typeof result.current.generateUserId).toBe('function');
    });

    it('generateUserId returns a string', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      const generatedId = result.current.generateUserId();
      expect(typeof generatedId).toBe('string');
      expect(generatedId.length).toBeGreaterThan(0);
    });

    it('setUserId accepts a string parameter', () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: UserProvider,
      });

      expect(() => {
        result.current.setUserId('test-id');
      }).not.toThrow();
    });
  });
});
