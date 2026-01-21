import React, { useState, FormEvent } from 'react';
import { useTranslation } from "../../../hooks";
import { FormField } from '../FormField';
import { VerifyFormValidator } from '../validators';
import { AUTH_VALIDATION } from '../constants';

interface VerifyFormProps {
  onSubmit: (email: string, code: string) => Promise<void>;
  onSwitchToResend: () => void;
  onSwitchToLogin: () => void;
  onBack?: () => void;
  loading?: boolean;
  initialEmail?: string;
}

export const VerifyForm: React.FC<VerifyFormProps> = ({
  onSubmit,
  onSwitchToResend,
  onSwitchToLogin,
  onBack,
  loading = false,
  initialEmail = '',
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validator = new VerifyFormValidator(t);

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
          marginBottom: 'var(--spacing-xl)'
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

      <FormField
        id="verify-code"
        label={t('auth.verificationCode')}
        value={code}
        onChange={setCode}
        error={errors.code}
        placeholder={t('auth.codePlaceholder')}
        disabled={loading}
        autoComplete="off"
        maxLength={AUTH_VALIDATION.CODE_LENGTH}
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
        className="flex flex-col gap-2 text-center"
        style={{ marginTop: 'var(--spacing-sm)' }}
      >
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
          {t('auth.resendLink')}
        </a>
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
