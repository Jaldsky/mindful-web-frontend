import { describe, it, expect } from 'vitest';
import { AUTH_VALIDATION, AUTH_STYLES } from '../../../src/components/auth/constants';

describe('AUTH_VALIDATION', () => {
  it('has correct username constraints', () => {
    expect(AUTH_VALIDATION.USERNAME_MIN_LENGTH).toBe(3);
    expect(AUTH_VALIDATION.USERNAME_MAX_LENGTH).toBe(30);
  });

  it('has correct password minimum length', () => {
    expect(AUTH_VALIDATION.PASSWORD_MIN_LENGTH).toBe(6);
  });

  it('has correct code length', () => {
    expect(AUTH_VALIDATION.CODE_LENGTH).toBe(6);
  });

  it('has username pattern for validation', () => {
    expect(AUTH_VALIDATION.USERNAME_PATTERN).toBeInstanceOf(RegExp);
  });

  it('username pattern validates correct usernames', () => {
    const validUsernames = ['user123', 'john_doe', 'test_user_123', 'ABC'];
    
    validUsernames.forEach(username => {
      expect(AUTH_VALIDATION.USERNAME_PATTERN.test(username)).toBe(true);
    });
  });

  it('username pattern rejects invalid usernames', () => {
    const invalidUsernames = ['user-name', 'user@name', 'user.name', 'user name', 'user!'];
    
    invalidUsernames.forEach(username => {
      expect(AUTH_VALIDATION.USERNAME_PATTERN.test(username)).toBe(false);
    });
  });
});

describe('AUTH_STYLES', () => {
  it('has input base class', () => {
    expect(AUTH_STYLES.INPUT_BASE).toBe('app-input w-full border');
  });

  it('has button base class', () => {
    expect(AUTH_STYLES.BUTTON_BASE).toBe('app-button w-full');
  });

  it('has error text class', () => {
    expect(AUTH_STYLES.ERROR_TEXT).toBe('text-red-500 text-sm mt-1');
  });

  it('has link text class', () => {
    expect(AUTH_STYLES.LINK_TEXT).toBe('text-sm hover:underline cursor-pointer');
  });

  it('all style values are strings', () => {
    Object.values(AUTH_STYLES).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });
});
