import React, { useState, FormEvent, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from "../../../hooks";
import { FormField } from '../FormField';
import { CodeInput } from '../CodeInput';
import { VerifyFormValidator } from '../validators';
import { AUTH_VALIDATION } from '../constants';

interface VerifyFormProps {
  onSubmit: (email: string, code: string) => Promise<void>;
  onSwitchToResend: () => void;
  onBack?: () => void;
  loading?: boolean;
  initialEmail?: string;
}

export const VerifyForm: React.FC<VerifyFormProps> = ({
  onSubmit,
  onSwitchToResend,
  onBack,
  loading = false,
  initialEmail = '',
}) => {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validator = useMemo(() => new VerifyFormValidator(t), [t]);
  const hasErrors = Object.keys(errors).length > 0;

  const areErrorsEqual = useCallback((nextErrors: Record<string, string>) => {
    const keys = Object.keys(errors);
    const nextKeys = Object.keys(nextErrors);
    if (keys.length !== nextKeys.length) return false;
    return keys.every((key) => errors[key] === nextErrors[key]);
  }, [errors]);

  useEffect(() => {
    if (!hasErrors) return;
    const validation = validator.validate({ email, code });
    if (!areErrorsEqual(validation.errors)) {
      setErrors(validation.errors);
    }
  }, [areErrorsEqual, code, email, hasErrors, locale, validator]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && Object.keys(errors).length > 0) {
        setErrors({});

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errors]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validator.validate({ email, code });
    setErrors(validation.errors);

    if (!validation.isValid) return;

    await onSubmit(email, code);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2
        className="text-center font-bold"
        style={{
          color: 'var(--color-primary)',
          fontSize: '32px',
          marginTop: '0',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        {t('auth.verifyTab')}
      </h2>

      <FormField
        id="verify-email"
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        placeholder={t('auth.emailPlaceholder')}
        disabled={loading}
        autoComplete="email"
        required
      />

      <div className="auth-form-group" style={{ marginBottom: 'var(--spacing-sm)' }}>
        <label
          htmlFor="verify-code"
          className="block font-medium"
          style={{
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {t('auth.verificationCode')}
          <span style={{ color: 'var(--color-error)' }}> *</span>
        </label>
        <CodeInput
          value={code}
          onChange={setCode}
          error={errors.code}
          disabled={loading}
          length={AUTH_VALIDATION.CODE_LENGTH}
        />
      </div>

      <div
        className="button-group auth-buttons"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)'
        }}
      >
        <button
          type="submit"
          disabled={loading}
          className="btn-base btn-primary btn-verify w-full"
        >
          {t('auth.verify')}
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="btn-base btn-secondary w-full"
          >
            {t('auth.back')}
          </button>
        )}
      </div>

      <div
        className="text-center"
        style={{ marginTop: 'var(--spacing-sm)' }}
      >
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {t('auth.needCode')}{' '}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToResend();
          }}
          className="transition-colors"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {t('auth.resend')}
        </a>
      </div>
    </form>
  );
};
