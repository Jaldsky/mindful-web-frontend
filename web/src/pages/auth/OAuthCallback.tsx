import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { useTranslation } from '../../hooks';
import { extractErrorMessage } from '../../utils';
import { OAUTH_PROVIDERS } from '../../components/auth/constants';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { provider } = useParams();
  const { t } = useTranslation();
  const { loginWithOAuth } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === '1') {
      return;
    }

    let isMounted = true;

    const finalizeOAuth = async () => {
      const code = params.get('code');
      const state = params.get('state');
      const oauthError = params.get('error');

      if (oauthError) {
        if (!isMounted) return;
        setError(oauthError);
        return;
      }

      if (!code || !state) {
        if (!isMounted) return;
        setError(t('auth.oauthMissingCode'));
        return;
      }

      try {
        const normalizedProvider = (provider || '').trim().toLowerCase();
        const isSupportedProvider = OAUTH_PROVIDERS.some((item) => item.key === normalizedProvider);
        if (!isSupportedProvider) {
          if (!isMounted) return;
          setError(t('auth.oauthProviderUnsupported'));
          return;
        }

        await loginWithOAuth(
          normalizedProvider,
          code,
          state,
          `${window.location.origin}/oauth/${normalizedProvider}/callback`
        );
        if (!isMounted) return;
        navigate('/', { replace: true });
      } catch (err) {
        if (!isMounted) return;
        setError(extractErrorMessage(err) || t('auth.oauthFailed'));
      }
    };

    finalizeOAuth();

    return () => {
      isMounted = false;
    };
  }, [loginWithOAuth, navigate, provider, t]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 pt-12"
      style={{
        backgroundColor: 'var(--color-bg-overlay)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '360px',
        }}
      >
        <div
          className="rounded-lg border"
          style={{
            background: 'var(--color-bg-primary)',
            borderColor: 'var(--border-color)',
            padding: 'var(--spacing-xxl)',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: '360px',
            position: 'relative',
          }}
        >
          {error && (
            <div
              style={{
                position: 'absolute',
                top: '92px',
                left: 'var(--spacing-xxl)',
                right: 'var(--spacing-xxl)',
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-error-text)',
                border: '1px solid var(--color-error-border)',
                fontSize: 'var(--font-size-md)',
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                minHeight: 52,
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 10,
              }}
            >
              <span style={{ flex: 1, textAlign: 'center', fontWeight: 500 }}>{error}</span>
              <button
                type="button"
                onClick={() => navigate('/auth', { replace: true })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-error-text)',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: 0,
                  lineHeight: 1,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          )}

          <h2
            className="text-center font-bold"
            style={{
              color: 'var(--color-primary)',
              fontSize: '32px',
              marginTop: 0,
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            {t('auth.oauthProcessingTitle')}
          </h2>

          {error ? (
            <button
              type="button"
              className="btn-base btn-primary w-full"
              onClick={() => navigate('/auth', { replace: true })}
            >
              {t('auth.back')}
            </button>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-success)',
                color: 'var(--color-success-text)',
                border: '1px solid var(--color-success-border)',
                fontSize: 'var(--font-size-md)',
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                minHeight: 52,
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span style={{ fontWeight: 500 }}>{t('auth.oauthProcessing')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
