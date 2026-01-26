/**
 * Auth Page Component
 * Full-screen auth forms without layout/header
 * Matching plugin design
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [isErrorVisible, setIsErrorVisible] = useState(false);
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
  
  const formRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const prevDisplayScreenRef = useRef<AuthScreen | null>(null);

  const animateFormChildren = (children: HTMLElement[]) => {

    children.forEach((child) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'none';
      child.style.animation = 'none';
    });

    if (children.length > 0 && formRef.current) {
      void formRef.current.offsetHeight;
    }

    children.forEach((child, index) => {
      setTimeout(() => {
        child.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        void child.offsetHeight;
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 100 + (index * 80));
    });
  };

  useLayoutEffect(() => {
    if (formRef.current && !isMeasuring) {
      const formElement = formRef.current.querySelector('.auth-form');
      if (formElement) {
        const children = Array.from(formElement.children) as HTMLElement[];

        if (prevDisplayScreenRef.current !== displayScreen) {
          hasAnimatedRef.current = false;
          children.forEach((child) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'none';
            child.style.animation = 'none';
          });
        } else if (!hasAnimatedRef.current) {
          children.forEach((child) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'none';
            child.style.animation = 'none';
          });
        }
      }
    }
  }, [displayScreen, isMeasuring]);

  useEffect(() => {
    const shouldAnimate = isVisible && 
      ((isTransitioning && !isMeasuring) || (!isTransitioning && !isMeasuring)) && 
      formRef.current && 
      !hasAnimatedRef.current;
    
    if (shouldAnimate) {
      const formElement = formRef.current.querySelector('.auth-form');
      if (formElement) {
        const children = Array.from(formElement.children) as HTMLElement[];
        
        if (children.length > 0) {
          hasAnimatedRef.current = true;
          prevDisplayScreenRef.current = displayScreen;

          requestAnimationFrame(() => {
            if (formRef.current) {
              const currentFormElement = formRef.current.querySelector('.auth-form');
              if (currentFormElement) {
                const currentChildren = Array.from(currentFormElement.children) as HTMLElement[];
                if (currentChildren.length > 0) {
                  animateFormChildren(currentChildren);
                }
              }
            }
          });
        }
      }
    }
  }, [isVisible, isTransitioning, isMeasuring, displayScreen]);

  useEffect(() => {
    document.title = `${t('auth.loginTab')} - ${t('common.appName')}`;
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [t]);

  useEffect(() => {
    if (authError) {
      setIsErrorVisible(true);
      return messageManager.scheduleHide(() => {
        setIsErrorVisible(false);
        setTimeout(() => setAuthError(null), 300);
      }, 5000);
    } else {
      setIsErrorVisible(false);
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
      navigate('/');
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
      switchScreen('login');
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
      setRegisteredEmail(email);
      switchScreen('verify');
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
      transition: isMeasuring ? 'none' as const : 'opacity 0.2s ease',
      pointerEvents: isMeasuring ? 'none' as const : 'auto' as const,
      position: isMeasuring ? ('absolute' as const) : ('relative' as const),
      width: isMeasuring ? '100%' : 'auto',
      visibility: isMeasuring ? ('hidden' as const) : ('visible' as const),
    };

    const className = `auth-form ${isTransitioning ? 'transitioning' : ''} ${isMeasuring ? 'measuring' : ''}`;

    return (
      <div ref={formRef} style={formStyle} className={className}>
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
            onSwitchToVerify={() => switchScreen('verify')}
            onBack={() => switchScreen('login')}
            loading={authLoading}
          />
        )}
        {displayScreen === 'verify' && (
          <VerifyForm
            onSubmit={handleVerify}
            onSwitchToResend={() => switchScreen('resend')}
            onBack={() => switchScreen('register')}
            loading={authLoading}
            initialEmail={registeredEmail}
          />
        )}
        {displayScreen === 'resend' && (
          <ResendForm
            onSubmit={handleResend}
            onBack={() => switchScreen('verify')}
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
            overflow: containerHeight === 'auto' ? 'visible' : 'hidden',
            height: containerHeight,
            transition: (!isVisible && !isTransitioning) ? 'none' : 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <AuthHeader />
          
          {/* Error Messages - placed at top of form for better visibility, absolute to not affect container height */}
          {authError && (
            <div
              style={{
                position: 'absolute',
                top: '70px',
                left: 'var(--spacing-xxl)',
                right: 'var(--spacing-xxl)',
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-error-text)',
                border: '1px solid var(--color-error-border)',
                fontSize: 'var(--font-size-sm)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--spacing-sm)',
                animation: isErrorVisible ? 'slideDownError 0.3s ease' : 'none',
                opacity: isErrorVisible ? 1 : 0,
                transform: isErrorVisible ? 'translateY(0)' : 'translateY(-20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 10,
                pointerEvents: isErrorVisible ? 'auto' : 'none',
              }}
            >
              <span style={{ flex: 1, textAlign: 'center' }}>{authError}</span>
              <button
                onClick={() => {
                  setIsErrorVisible(false);
                  setTimeout(() => setAuthError(null), 300);
                }}
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

          {renderForm()}
        </div>

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

        {/* Legal Links */}
        <p
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--spacing-lg)',
            textAlign: 'center',
          }}
        >
          {t('welcome.footerPrefix')}{' '}
          <Link
            to="/terms"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            {t('welcome.footerTerms')}
          </Link>
          {' '}{t('welcome.footerAnd')}{' '}
          <Link
            to="/privacy"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            {t('welcome.footerPrivacy')}
          </Link>
        </p>
      </div>
    </div>
  );
};
