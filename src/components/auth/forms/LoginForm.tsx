import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from "../../../hooks";
import { FormField } from '../FormField';
import { LoginFormValidator } from '../validators';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onBack?: () => void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
  onBack,
  loading = false,
}) => {
  const { t, locale } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validator = useMemo(() => new LoginFormValidator(t), [t]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const validation = validator.validate({ username, password });
      setErrors(validation.errors);
    }
  }, [locale]);

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
    
    const validation = validator.validate({ username, password });
    setErrors(validation.errors);

    if (!validation.isValid) return;

    await onSubmit(username, password);
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
        {t('auth.loginTab')}
      </h2>

      <FormField
        id="username"
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
        id="password"
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        placeholder={t('auth.passwordPlaceholder')}
        disabled={loading}
        autoComplete="current-password"
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
          {t('auth.login')}
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
          {t('auth.noAccount')}{' '}
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToRegister();
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
          {t('auth.registerLink')}
        </a>
      </div>
    </form>
  );
};
