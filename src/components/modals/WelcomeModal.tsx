/**
 * Welcome Modal Component
 * Displays onboarding modal on first launch
 * Matching plugin design with animations
 */

import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { useTranslation } from "../../hooks";
import { useLocale, SUPPORTED_LOCALES } from '../../contexts';
import { useTheme } from '../../contexts';
import { THEME } from '../../constants';
import { WelcomeModalProps } from './types';
import { MODAL_STYLES } from './constants';
import { ModalHeader, ModalFeatureItem, ModalActionButtons, ModalToggleButton } from './controls';
import { useModalAnimation } from './hooks/useModalAnimation';

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onCreateAnonymous,
  onRegister,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const { isVisible, isTransitioning, handleTransition } = useModalAnimation(isOpen);
  const prevIsOpenRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Hide elements immediately on mount to prevent flash
  useLayoutEffect(() => {
    if (isOpen && !hasAnimatedRef.current) {
      const hideElements = () => {
        if (contentContainerRef.current) {
          const children = Array.from(contentContainerRef.current.children) as HTMLElement[];
          children.forEach((child) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'none';
            child.style.animation = 'none';
          });
        }
      };
      hideElements();
      requestAnimationFrame(hideElements);
    }
  }, [isOpen]);

  // Helper function to animate children (like plugin)
  const animateChildren = (children: HTMLElement[]) => {
    // Ensure all children are hidden (they should already be from useLayoutEffect)
    children.forEach((child) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = 'none';
      child.style.animation = 'none';
    });
    
    // Force reflow
    if (children.length > 0 && contentContainerRef.current) {
      void contentContainerRef.current.offsetHeight;
    }
    
    // Animate each child with delay (like plugin: 100ms + index * 80ms)
    children.forEach((child, index) => {
      setTimeout(() => {
        child.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        // Force reflow
        void child.offsetHeight;
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 100 + (index * 80));
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.title = t('common.appName');
      
      // Apply plugin-style animation - wait for modal to be visible
      if (isVisible && !isTransitioning && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        
        // Start animation immediately when modal is visible
        requestAnimationFrame(() => {
          if (contentContainerRef.current) {
            const children = Array.from(contentContainerRef.current.children) as HTMLElement[];
            
            if (children.length === 0) {
              // Retry if children not found yet
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  const retryChildren = Array.from(contentContainerRef.current?.children || []) as HTMLElement[];
                  if (retryChildren.length > 0) {
                    animateChildren(retryChildren);
                  }
                });
              });
              return;
            }
            
            animateChildren(children);
          }
        });
      } else if (isVisible && !isTransitioning && hasAnimatedRef.current) {
        // Fallback: if modal is visible but elements are still hidden, make them visible
        if (contentContainerRef.current) {
          const children = Array.from(contentContainerRef.current.children) as HTMLElement[];
          children.forEach((child) => {
            const opacity = window.getComputedStyle(child).opacity;
            if (opacity === '0') {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
              child.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
          });
        }
      }
    } else {
      // Reset animation flag when modal closes
      hasAnimatedRef.current = false;
    }
    
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isVisible, isTransitioning, t]);

  if (!isOpen) return null;

  const toggleTheme = () => {
    setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  };

  const toggleLocale = () => {
    setLocale(locale === SUPPORTED_LOCALES.EN ? SUPPORTED_LOCALES.RU : SUPPORTED_LOCALES.EN);
  };

  const handleSignIn = () => {
    handleTransition(onRegister);
  };

  const handleAnonymous = () => {
    handleTransition(onCreateAnonymous);
  };

  const themeIcon =
    theme === THEME.LIGHT ? (
      '☀️'
    ) : (
      <span style={{ fontSize: '14px' }}>🌙</span>
    );

  const localeIcon = locale === SUPPORTED_LOCALES.EN ? '🇺🇸' : '🇷🇺';

  const themeTitle =
    theme === THEME.LIGHT ? t('common.themeDark') : t('common.themeLight');

  const localeTitle =
    locale === SUPPORTED_LOCALES.EN
      ? 'Переключить на русский / Switch to Russian'
      : 'Switch to English / Переключить на английский';

  const features = [
    t('welcome.feature1'),
    t('welcome.feature2'),
    t('welcome.feature3'),
  ];

  return (
    <div
      className="fixed inset-0 flex justify-center z-[1000] overflow-y-auto p-4 pt-12"
      style={{
        backgroundColor: 'var(--color-bg-overlay)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: MODAL_STYLES.CONTAINER.MAX_WIDTH,
        }}
      >
        <div
          className="w-full rounded-lg border text-center"
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
          {/* Theme and Language Toggles - positioned like in Auth page */}
          <div
            style={{
              position: 'absolute',
              top: 'var(--spacing-sm)',
              right: 'var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <ModalToggleButton
              icon={themeIcon}
              onClick={toggleTheme}
              title={themeTitle}
            />
            <ModalToggleButton
              icon={localeIcon}
              onClick={toggleLocale}
              title={localeTitle}
            />
          </div>

          <div ref={contentContainerRef}>
            {/* Header */}
            <div>
              <ModalHeader
                title={t('welcome.title')}
                subtitle={t('welcome.subtitle')}
                shouldAnimate={false}
              />
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                marginBottom: 0,
              }}
            >
              {features.map((feature, index) => (
                <ModalFeatureItem key={index} text={feature} index={index} shouldAnimate={false} />
              ))}
            </div>

            {/* Actions */}
            <div>
              <ModalActionButtons
                onSignIn={handleSignIn}
                onAnonymous={handleAnonymous}
                disabled={loading || isTransitioning}
                signInText={t('welcome.signIn')}
                anonymousText={t('welcome.continueAnonymous')}
                shouldAnimate={false}
              />
            </div>

            {/* Footer */}
            <p
              className="text-center"
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-lg)',
                marginBottom: 0,
              }}
            >
              {t('welcome.footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
