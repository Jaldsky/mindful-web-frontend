/**
 * Welcome Modal Component
 * Displays onboarding modal on first launch
 * Matching plugin design with animations
 */

import React, { useEffect } from 'react';
import { useTranslation } from "../../hooks";
import { useLocale, SUPPORTED_LOCALES } from '../../contexts';
import { useTheme } from '../../contexts';
import { THEME } from '../../constants';
import { WelcomeModalProps } from './types';
import { MODAL_STYLES, MODAL_ANIMATION } from './constants';
import { ModalHeader, ModalFeatureItem, ModalActionButtons } from './controls';
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

  useEffect(() => {
    if (isOpen) {
      document.title = t('common.appName');
    }
  }, [isOpen, t]);

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
      className="min-h-screen flex justify-center p-4 pt-12"
      style={{
        backgroundColor: 'var(--color-bg-overlay)',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div className="w-full" style={{ maxWidth: MODAL_STYLES.CONTAINER.MAX_WIDTH }}>
        <div
          className="w-full rounded-lg border"
          style={{
            background: 'var(--color-bg-primary)',
            borderColor: 'var(--border-color)',
            padding: 'var(--spacing-xxl)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden',
            opacity:
              isVisible && !isTransitioning
                ? MODAL_ANIMATION.STATES.VISIBLE.opacity
                : MODAL_ANIMATION.STATES.HIDDEN.opacity,
            transform:
              isVisible && !isTransitioning
                ? `scale(${MODAL_ANIMATION.STATES.VISIBLE.scale})`
                : `scale(${MODAL_ANIMATION.STATES.HIDDEN.scale})`,
            transition:
              'opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <ModalHeader
            title={t('welcome.title')}
            subtitle={t('welcome.subtitle')}
            onToggleTheme={toggleTheme}
            onToggleLocale={toggleLocale}
            themeIcon={themeIcon}
            themeTitle={themeTitle}
            localeIcon={localeIcon}
            localeTitle={localeTitle}
          />

          {/* Features */}
          <div
            key={`features-${locale}`}
            className="mb-8"
            style={{
              transition: 'opacity 0.3s ease',
              animation: `fadeIn 0.3s ease ${MODAL_ANIMATION.FADE_DELAYS.FEATURES} backwards`,
              paddingLeft: 'var(--spacing-lg)',
              paddingRight: 'var(--spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
            }}
          >
            {features.map((feature, index) => (
              <ModalFeatureItem key={index} text={feature} />
            ))}
          </div>

          {/* Actions */}
          <ModalActionButtons
            onSignIn={handleSignIn}
            onAnonymous={handleAnonymous}
            disabled={loading || isTransitioning}
            signInText={t('welcome.signIn')}
            anonymousText={t('welcome.continueAnonymous')}
          />

          {/* Footer */}
          <p
            key={`footer-${locale}`}
            className="text-center mt-6"
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--spacing-xl)',
              animation: `fadeIn 0.3s ease ${MODAL_ANIMATION.FADE_DELAYS.FOOTER} backwards`,
            }}
          >
            {t('welcome.footer')}
          </p>
        </div>
      </div>
    </div>
  );
};
