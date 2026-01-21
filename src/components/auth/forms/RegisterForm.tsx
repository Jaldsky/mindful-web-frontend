import React, { useState, FormEvent } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FormField } from '../FormField';
import { RegisterFormValidator } from '../validators';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  onBack,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validator = new RegisterFormValidator(t);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validator.validate({ username, email, password });
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
          marginBottom: 'var(--spacing-xl)'
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

      <div
        className="button-group auth-buttons"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          marginTop: 'var(--spacing-xl)',
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
        className="app-login-link text-center"
        style={{ marginTop: 'var(--spacing-sm)' }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToLogin();
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
          {t('auth.loginLink')}
        </a>
      </div>
    </form>
  );
};
