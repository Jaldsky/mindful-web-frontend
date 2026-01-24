import React, { FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from '../../hooks';
import { CodeInput } from '../auth/CodeInput';
import { AUTH_VALIDATION } from '../auth/constants';
import { MODAL_STYLES } from './constants';
import { useModalAnimation } from './hooks/useModalAnimation';

interface EmailVerificationModalProps {
  isOpen: boolean;
  email: string | null;
  code: string;
  onCodeChange: (value: string) => void;
  onClose: () => void;
  onVerify: () => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
  error: string;
  info: string;
  infoTone: 'success' | 'error';
  isSuccess: boolean;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  email,
  code,
  onCodeChange,
  onClose,
  onVerify,
  onResend,
  isVerifying,
  isResending,
  error,
  info,
  infoTone,
  isSuccess,
}) => {
  const { t } = useTranslation();
  const { isVisible, isTransitioning } = useModalAnimation(isOpen);
  const infoIsError = infoTone === 'error';

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onVerify();
  };

  return (
    <div
      className="fixed inset-0 flex justify-center z-[1000] overflow-y-auto p-4 pt-12"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        fontFamily: 'var(--font-family)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: MODAL_STYLES.CONTAINER.MAX_WIDTH,
        }}
      >
        <div
          className="w-full rounded-lg border"
          style={{
            background: 'var(--color-bg-primary)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-xxl)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden',
            opacity: isVisible && !isTransitioning ? 1 : 0,
            transform:
              isVisible && !isTransitioning
                ? 'translateY(0) scale(1)'
                : 'translateY(-30px) scale(0.95)',
            transition:
              'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: isVisible && !isTransitioning ? 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            pointerEvents: isVisible && !isTransitioning ? 'auto' : 'none',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            title={t('common.close')}
            style={{
              position: 'absolute',
              top: 'var(--spacing-sm)',
              right: 'var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              color: 'var(--color-text-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
              <h2
                className="font-bold"
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '26px',
                  marginTop: 0,
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {t('profile.verifyEmailTitle')}
              </h2>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {t('profile.verifyEmailSubtitle', { email: email || '' })}
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label
                htmlFor="email-verify-code"
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
                onChange={onCodeChange}
                error={error}
                showErrorText={false}
                disabled={isVerifying}
                length={AUTH_VALIDATION.CODE_LENGTH}
              />
              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-error)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  <X size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {(info || isSuccess) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'var(--font-size-xs)',
                  color: infoIsError ? 'var(--color-error)' : 'var(--color-primary)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                {infoIsError ? <X size={16} /> : <Check size={16} />}
                <span>{info || t('profile.verifyEmailSuccess')}</span>
              </div>
            )}

            <div
              className="button-group"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-md)',
              }}
            >
              <button
                type="submit"
                disabled={isVerifying || code.length < AUTH_VALIDATION.CODE_LENGTH}
                className="btn-base btn-primary w-full"
              >
                {t('auth.verify')}
              </button>
              <button
                type="button"
                disabled={isResending || isVerifying}
                onClick={onResend}
                className="btn-base btn-secondary btn-verify w-full"
              >
                {isResending ? t('auth.resendTab') : t('profile.verifyEmailResend')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
