import { describe, it, expect } from 'vitest';
import {
  AUTH_VALIDATION,
  AUTH_STYLES,
  OAUTH_PROVIDERS,
  type OAuthProviderOption,
} from '../../../src/components/auth/constants';

describe('auth constants', () => {
  describe('AUTH_VALIDATION', () => {
    it('defines USERNAME_MIN_LENGTH', () => {
      expect(AUTH_VALIDATION.USERNAME_MIN_LENGTH).toBe(3);
    });

    it('defines USERNAME_MAX_LENGTH', () => {
      expect(AUTH_VALIDATION.USERNAME_MAX_LENGTH).toBe(30);
    });

    it('defines PASSWORD_MIN_LENGTH', () => {
      expect(AUTH_VALIDATION.PASSWORD_MIN_LENGTH).toBe(6);
    });

    it('defines CODE_LENGTH', () => {
      expect(AUTH_VALIDATION.CODE_LENGTH).toBe(6);
    });

    it('defines USERNAME_PATTERN regex', () => {
      expect(AUTH_VALIDATION.USERNAME_PATTERN.test('valid_user')).toBe(true);
      expect(AUTH_VALIDATION.USERNAME_PATTERN.test('Invalid')).toBe(true);
      expect(AUTH_VALIDATION.USERNAME_PATTERN.test('user@name')).toBe(false);
    });
  });

  describe('AUTH_STYLES', () => {
    it('defines INPUT_BASE class string', () => {
      expect(AUTH_STYLES.INPUT_BASE).toContain('app-input');
    });

    it('defines BUTTON_BASE class string', () => {
      expect(AUTH_STYLES.BUTTON_BASE).toContain('app-button');
    });

    it('defines ERROR_TEXT class string', () => {
      expect(AUTH_STYLES.ERROR_TEXT).toContain('text-red-500');
    });

    it('defines LINK_TEXT class string', () => {
      expect(AUTH_STYLES.LINK_TEXT).toContain('cursor-pointer');
    });
  });

  describe('OAUTH_PROVIDERS', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(OAUTH_PROVIDERS)).toBe(true);
      expect(OAUTH_PROVIDERS.length).toBeGreaterThan(0);
    });

    it('includes Google provider', () => {
      const google = OAUTH_PROVIDERS.find((p) => p.key === 'google');
      expect(google).toBeDefined();
      expect(google?.label).toBe('Google');
    });

    it('each provider has key and label', () => {
      OAUTH_PROVIDERS.forEach((provider: OAuthProviderOption) => {
        expect(provider).toHaveProperty('key');
        expect(provider).toHaveProperty('label');
        expect(typeof provider.key).toBe('string');
        expect(typeof provider.label).toBe('string');
      });
    });
  });
});
