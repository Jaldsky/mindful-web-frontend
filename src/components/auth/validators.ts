import { AUTH_VALIDATION } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface Validator<T> {
  validate(data: T): ValidationResult;
}

export class UsernameValidator {
  validate(username: string, t: (key: string) => string): string | undefined {
    if (!username.trim()) {
      return t('auth.errors.usernameRequired');
    }
    if (username.length < AUTH_VALIDATION.USERNAME_MIN_LENGTH) {
      return t('auth.errors.usernameTooShort');
    }
    if (username.length > AUTH_VALIDATION.USERNAME_MAX_LENGTH) {
      return t('auth.errors.usernameTooLong');
    }
    if (!AUTH_VALIDATION.USERNAME_PATTERN.test(username)) {
      return t('auth.errors.usernameInvalid');
    }
    return undefined;
  }
}

export class EmailValidator {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(email: string, t: (key: string) => string): string | undefined {
    if (!email.trim()) {
      return t('auth.errors.emailRequired');
    }
    if (!EmailValidator.EMAIL_PATTERN.test(email)) {
      return t('auth.errors.emailInvalid');
    }
    return undefined;
  }
}

export class PasswordValidator {
  validate(password: string, t: (key: string) => string): string | undefined {
    if (!password) {
      return t('auth.errors.passwordRequired');
    }
    if (password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
      return t('auth.errors.passwordTooShort');
    }
    return undefined;
  }
}

export class CodeValidator {
  validate(code: string, t: (key: string) => string): string | undefined {
    if (!code.trim()) {
      return t('auth.errors.codeRequired');
    }
    if (code.length !== AUTH_VALIDATION.CODE_LENGTH) {
      return t('auth.errors.codeInvalid');
    }
    return undefined;
  }
}

export class LoginFormValidator implements Validator<{ username: string; password: string }> {
  private usernameValidator = new UsernameValidator();
  private passwordValidator = new PasswordValidator();

  constructor(private t: (key: string) => string) {}

  validate(data: { username: string; password: string }): ValidationResult {
    const errors: Record<string, string> = {};

    const usernameError = this.usernameValidator.validate(data.username, this.t);
    if (usernameError) {
      errors.username = usernameError;
    }

    const passwordError = this.passwordValidator.validate(data.password, this.t);
    if (passwordError) {
      errors.password = passwordError;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export class RegisterFormValidator implements Validator<{ username: string; email: string; password: string }> {
  private usernameValidator = new UsernameValidator();
  private emailValidator = new EmailValidator();
  private passwordValidator = new PasswordValidator();

  constructor(private t: (key: string) => string) {}

  validate(data: { username: string; email: string; password: string }): ValidationResult {
    const errors: Record<string, string> = {};

    const usernameError = this.usernameValidator.validate(data.username, this.t);
    if (usernameError) {
      errors.username = usernameError;
    }

    const emailError = this.emailValidator.validate(data.email, this.t);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = this.passwordValidator.validate(data.password, this.t);
    if (passwordError) {
      errors.password = passwordError;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export class VerifyFormValidator implements Validator<{ email: string; code: string }> {
  private emailValidator = new EmailValidator();
  private codeValidator = new CodeValidator();

  constructor(private t: (key: string) => string) {}

  validate(data: { email: string; code: string }): ValidationResult {
    const errors: Record<string, string> = {};

    const emailError = this.emailValidator.validate(data.email, this.t);
    if (emailError) {
      errors.email = emailError;
    }

    const codeError = this.codeValidator.validate(data.code, this.t);
    if (codeError) {
      errors.code = codeError;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
