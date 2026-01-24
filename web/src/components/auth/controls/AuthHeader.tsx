/**
 * Auth Header Component
 * Theme and locale switchers for auth screens
 * Matching WelcomeModal design
 */

import React from 'react';
import { useLocale, SUPPORTED_LOCALES } from '../../../contexts';
import { useTheme } from '../../../contexts';
import { THEME } from '../../../constants';
import { useTranslation } from '../../../hooks';
import { ModalToggleButton } from '../../modals/controls/ModalToggleButton';

export const AuthHeader: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  };

  const toggleLocale = () => {
    setLocale(locale === SUPPORTED_LOCALES.EN ? SUPPORTED_LOCALES.RU : SUPPORTED_LOCALES.EN);
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

  return (
    <div
      style={{
        position: 'absolute',
        top: 'var(--spacing-sm)',
        right: 'var(--spacing-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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
  );
};
