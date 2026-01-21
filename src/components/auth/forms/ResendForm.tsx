import React, { useState, FormEvent } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FormField } from '../FormField';
import { EmailValidator } from '../validators';

interface ResendFormProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  loading?: boolean;
  initialEmail?: string;
}

export const ResendForm: React.FC<ResendFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  onBack,
  loading = false,
  initialEmail = '',
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string>();

  const emailValidator = new EmailValidator();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = emailValidator.validate(email, t);
    setError(validationError);

    if (validationError) return;

    await onSubmit(email);
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
        {t('auth.resendTab')}
      </h2>

      <FormField
        id="resend-email"
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={setEmail}
        error={error}
        placeholder={t('auth.emailPlaceholder')}
        disabled={loading}
        autoComplete="email"
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
          {t('auth.resend')}
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
