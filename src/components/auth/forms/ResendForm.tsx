import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { useTranslation } from "../../../hooks";
import { FormField } from '../FormField';
import { EmailValidator } from '../validators';

interface ResendFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack?: () => void;
  loading?: boolean;
  initialEmail?: string;
}

export const ResendForm: React.FC<ResendFormProps> = ({
  onSubmit,
  onBack,
  loading = false,
  initialEmail = '',
}) => {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string>();

  const emailValidator = useMemo(() => new EmailValidator(), []);

  useEffect(() => {
    if (error) {
      const validationError = emailValidator.validate(email, t);
      setError(validationError);
    }
  }, [email, emailValidator, error, locale, t]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && error) {
        setError(undefined);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [error]);

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
          marginBottom: 'var(--spacing-lg)'
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

    </form>
  );
};
