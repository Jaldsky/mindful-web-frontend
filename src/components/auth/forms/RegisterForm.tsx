import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from "../../../hooks";
import { FormField } from '../FormField';
import { RegisterFormValidator } from '../validators';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToVerify: () => void;
  onBack?: () => void;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToVerify,
  onBack,
  loading = false,
}) => {
  const { t, locale } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validator = useMemo(() => new RegisterFormValidator(t), [t]);

  // Re-validate errors when locale changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const validation = validator.validate({ username, email, password, confirmPassword });
      setErrors(validation.errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Clear errors on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && Object.keys(errors).length > 0) {
        setErrors({});
        // Remove focus from active element
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

    const validation = validator.validate({ username, email, password, confirmPassword });
    setErrors(validation.errors);

    if (!validation.isValid) return;

    await onSubmit(username, email, password);
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
        {t('auth.registerTab')}
      </h2>

      <FormField
        id="register-username"
        label={t('auth.username')}
        value={username}
        onChange={setUsername}
        error={errors.username}
        placeholder={t('auth.usernamePlaceholder')}
        disabled={loading}
        autoComplete="username"
        required
      />

      <FormField
        id="register-email"
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

      <FormField
        id="register-password"
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        placeholder={t('auth.passwordPlaceholder')}
        disabled={loading}
        autoComplete="new-password"
        required
      />

      <FormField
        id="register-confirm-password"
        label={t('auth.confirmPassword')}
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        placeholder={t('auth.confirmPasswordPlaceholder')}
        disabled={loading}
        autoComplete="new-password"
        required
      />

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
          className="btn-base btn-primary w-full"
        >
          {t('auth.register')}
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
        className="app-register-link text-center"
        style={{ marginTop: 'var(--spacing-sm)' }}
      >
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {t('auth.alreadyHaveCode')}{' '}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToVerify();
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
          {t('auth.verify')}
        </a>
      </div>
    </form>
  );
};
