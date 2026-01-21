/**
 * Auth Page Component
 * Full-screen auth forms without layout/header
 * Matching plugin design
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, useAuthAnimation } from '../../hooks';
import { useAuth } from '../../contexts';
import { AuthHeader, LoginForm, RegisterForm, VerifyForm, ResendForm } from '../../components/auth';
import type { AuthScreen } from '../../components/auth';
import { messageManager, navigationService } from '../../utils';

export const Auth: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register, verify, resendCode } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    displayScreen,
    isTransitioning,
    isMeasuring,
    containerHeight,
    containerWidth,
    containerRef,
    switchScreen,
  } = useAuthAnimation('login' as AuthScreen, !isVisible);

  useEffect(() => {
    document.title = `${t('auth.loginTab')} - ${t('common.appName')}`;
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [t]);

  useEffect(() => {
    if (authError) {
      return messageManager.scheduleHide(() => setAuthError(null), 5000);
    }
  }, [authError]);

  useEffect(() => {
    if (authMessage) {
      return messageManager.scheduleHide(() => setAuthMessage(null), 3000);
    }
  }, [authMessage]);

  const handleLogin = async (username: string, password: string) => {
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      await login(username, password);
      setAuthMessage(t('auth.loginSuccess'));
      navigationService.scheduleNavigation(() => navigate('/'), 1000);
    } catch (err) {
      setAuthError((err as Error).message || t('auth.genericError'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      await register(username, email, password);
      setRegisteredEmail(email);
      setAuthMessage(t('auth.registerSuccess'));
      switchScreen('verify');
    } catch (err) {
      setAuthError((err as Error).message || t('auth.genericError'));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerify = async (email: string, code: string) => {
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      await verify(email, code);
      setAuthMessage(t('auth.verifySuccess'));
      navigationService.scheduleNavigation(() => switchScreen('login'), 1500);
    } catch (err) {
      setAuthError((err as Error).message || t('auth.genericError'));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResend = async (email: string) => {
    setAuthError(null);
    setAuthMessage(null);
    setAuthLoading(true);
    try {
      await resendCode(email);
      setAuthMessage(t('auth.resendSuccess'));
    } catch (err) {
      setAuthError((err as Error).message || t('auth.genericError'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBack = () => {
    navigationService.fadeOutAndNavigate(setIsVisible, () => navigate('/welcome'), 300);
  };

  const renderForm = () => {
    const formStyle = {
      opacity: isMeasuring ? 0 : 1,
      transition: 'none' as const,
    };

    const className = `auth-form ${isTransitioning ? 'transitioning' : ''} ${isMeasuring ? 'measuring' : ''}`;

    return (
      <div style={formStyle} className={className}>
        {displayScreen === 'login' && (
          <LoginForm
            onSubmit={handleLogin}
            onSwitchToRegister={() => switchScreen('register')}
            onBack={handleBack}
            loading={authLoading}
          />
        )}
        {displayScreen === 'register' && (
          <RegisterForm
            onSubmit={handleRegister}
            onSwitchToLogin={() => switchScreen('login')}
            onBack={handleBack}
            loading={authLoading}
          />
        )}
        {displayScreen === 'verify' && (
          <VerifyForm
            onSubmit={handleVerify}
            onSwitchToResend={() => switchScreen('resend')}
            onSwitchToLogin={() => switchScreen('login')}
            onBack={handleBack}
            loading={authLoading}
            initialEmail={registeredEmail}
          />
        )}
        {displayScreen === 'resend' && (
          <ResendForm
            onSubmit={handleResend}
            onSwitchToLogin={() => switchScreen('login')}
            onBack={handleBack}
            loading={authLoading}
            initialEmail={registeredEmail}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex justify-center p-4 pt-12"
      style={{
        backgroundColor: 'var(--color-bg-overlay)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '360px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.98)',
          transition: 'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {/* Auth Forms Container */}
        <div
          ref={containerRef}
          className="rounded-lg border"
          style={{
            background: 'var(--color-bg-primary)',
            borderColor: 'var(--border-color)',
            padding: 'var(--spacing-xxl)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '360px',
            width: containerWidth,
            position: 'relative',
            overflow: 'hidden',
            height: containerHeight,
            transition: !isVisible ? 'none' : 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <AuthHeader />
          {renderForm()}
        </div>

        {/* Error Messages */}
        {authError && (
          <div
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-error-text)',
              border: '1px solid var(--color-error-border)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--spacing-sm)',
              animation: 'slideUp 0.3s ease',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <span style={{ flex: 1, textAlign: 'center' }}>{authError}</span>
            <button
              onClick={() => setAuthError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-error-text)',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0',
                lineHeight: '1',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {/* Success Messages */}
        {authMessage && (
          <div
            style={{
              backgroundColor: 'var(--color-success)',
              color: 'var(--color-success-text)',
              border: '1px solid var(--color-success-border)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--spacing-sm)',
              animation: 'slideUp 0.3s ease',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <span style={{ flex: 1, textAlign: 'center' }}>{authMessage}</span>
            <button
              onClick={() => setAuthMessage(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-success-text)',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0',
                lineHeight: '1',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
