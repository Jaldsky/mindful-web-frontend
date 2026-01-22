import { describe, it, expect } from 'vitest';
import {
  UsernameValidator,
  EmailValidator,
  PasswordValidator,
  CodeValidator,
  LoginFormValidator,
  RegisterFormValidator,
  VerifyFormValidator,
} from '../../../src/components/auth/validators';
import { AUTH_VALIDATION } from '../../../src/components/auth/constants';

const mockT = (key: string) => key;

describe('UsernameValidator', () => {
  const validator = new UsernameValidator();

  it('validates correct username', () => {
    expect(validator.validate('testuser', mockT)).toBeUndefined();
  });

  it('rejects empty username', () => {
    expect(validator.validate('', mockT)).toBe('auth.errors.usernameRequired');
  });

  it('rejects short username', () => {
    expect(validator.validate('ab', mockT)).toBe('auth.errors.usernameTooShort');
  });

  it('rejects long username', () => {
    const longUsername = 'a'.repeat(AUTH_VALIDATION.USERNAME_MAX_LENGTH + 1);
    expect(validator.validate(longUsername, mockT)).toBe('auth.errors.usernameTooLong');
  });

  it('rejects username with invalid characters', () => {
    expect(validator.validate('test@user', mockT)).toBe('auth.errors.usernameInvalid');
  });
});

describe('EmailValidator', () => {
  const validator = new EmailValidator();

  it('validates correct email', () => {
    expect(validator.validate('test@example.com', mockT)).toBeUndefined();
  });

  it('rejects empty email', () => {
    expect(validator.validate('', mockT)).toBe('auth.errors.emailRequired');
  });

  it('rejects invalid email format', () => {
    expect(validator.validate('invalid-email', mockT)).toBe('auth.errors.emailInvalid');
    expect(validator.validate('test@', mockT)).toBe('auth.errors.emailInvalid');
    expect(validator.validate('@example.com', mockT)).toBe('auth.errors.emailInvalid');
  });
});

describe('PasswordValidator', () => {
  const validator = new PasswordValidator();

  it('validates correct password', () => {
    expect(validator.validate('password123', mockT)).toBeUndefined();
  });

  it('rejects empty password', () => {
    expect(validator.validate('', mockT)).toBe('auth.errors.passwordRequired');
  });

  it('rejects short password', () => {
    expect(validator.validate('12345', mockT)).toBe('auth.errors.passwordTooShort');
  });
});

describe('CodeValidator', () => {
  const validator = new CodeValidator();

  it('validates correct code', () => {
    expect(validator.validate('123456', mockT)).toBeUndefined();
  });

  it('rejects empty code', () => {
    expect(validator.validate('', mockT)).toBe('auth.errors.codeRequired');
  });

  it('rejects invalid code length', () => {
    expect(validator.validate('12345', mockT)).toBe('auth.errors.codeInvalid');
    expect(validator.validate('1234567', mockT)).toBe('auth.errors.codeInvalid');
  });
});

describe('LoginFormValidator', () => {
  const validator = new LoginFormValidator(mockT);

  it('validates correct login form', () => {
    const result = validator.validate({ username: 'testuser', password: 'password123' });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid username', () => {
    const result = validator.validate({ username: '', password: 'password123' });
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe('auth.errors.usernameRequired');
  });

  it('returns errors for invalid password', () => {
    const result = validator.validate({ username: 'testuser', password: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe('auth.errors.passwordRequired');
  });

  it('returns multiple errors', () => {
    const result = validator.validate({ username: '', password: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe('auth.errors.usernameRequired');
    expect(result.errors.password).toBe('auth.errors.passwordRequired');
  });
});

describe('RegisterFormValidator', () => {
  const validator = new RegisterFormValidator(mockT);

  it('validates correct register form', () => {
    const result = validator.validate({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for all invalid fields', () => {
    const result = validator.validate({ 
      username: '', 
      email: '', 
      password: '',
      confirmPassword: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe('auth.errors.usernameRequired');
    expect(result.errors.email).toBe('auth.errors.emailRequired');
    expect(result.errors.password).toBe('auth.errors.passwordRequired');
    expect(result.errors.confirmPassword).toBe('auth.errors.confirmPasswordRequired');
  });

  it('returns error when passwords do not match', () => {
    const result = validator.validate({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toBe('auth.errors.passwordsDoNotMatch');
  });

  it('validates when passwords match', () => {
    const result = validator.validate({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors.confirmPassword).toBeUndefined();
  });
});

describe('VerifyFormValidator', () => {
  const validator = new VerifyFormValidator(mockT);

  it('validates correct verify form', () => {
    const result = validator.validate({ email: 'test@example.com', code: '123456' });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid fields', () => {
    const result = validator.validate({ email: '', code: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('auth.errors.emailRequired');
    expect(result.errors.code).toBe('auth.errors.codeRequired');
  });
});
