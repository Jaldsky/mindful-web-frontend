import React from 'react';
import { useTheme } from '../../../contexts';
import { useLocale, SUPPORTED_LOCALES } from '../../../contexts';
import { useTranslation } from "../../../hooks";
import { ModalToggleButton } from '../../modals';

interface HeaderControlsProps {
  variant?: 'horizontal' | 'vertical';
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ variant = 'horizontal' }) => {
  const { isDark, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();

  const toggleLocale = () => {
    setLocale(locale === SUPPORTED_LOCALES.EN ? SUPPORTED_LOCALES.RU : SUPPORTED_LOCALES.EN);
  };

  const isVertical = variant === 'vertical';

  const themeIcon = isDark ? '☀️' : <span style={{ fontSize: '14px' }}>🌙</span>;
  const localeIcon = locale === SUPPORTED_LOCALES.EN ? '🇺🇸' : '🇷🇺';

  const themeTitle = isDark ? t('common.themeLight') : t('common.themeDark');
  const localeTitle =
    locale === SUPPORTED_LOCALES.EN
      ? 'Переключить на русский / Switch to Russian'
      : 'Switch to English / Переключить на английский';

  return (
    <div
      className={isVertical ? '' : 'flex-shrink-0'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isVertical ? 'flex-start' : 'flex-end',
        gap: isVertical ? 'var(--spacing-md)' : 'var(--spacing-sm)',
        width: isVertical ? '100%' : 'auto',
        flexDirection: isVertical ? 'column' : 'row',
      }}
    >
      <ModalToggleButton icon={themeIcon} onClick={toggleTheme} title={themeTitle} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          flexShrink: 0,
        }}
      >
        <ModalToggleButton icon={localeIcon} onClick={toggleLocale} title={localeTitle} />
        <button
          onClick={toggleLocale}
          title={localeTitle}
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary)',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: 'var(--border-radius-sm)',
            transition: 'all 0.2s ease',
            width: '24px',
            textAlign: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            e.currentTarget.style.color = 'var(--color-primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-primary)';
          }}
        >
          {locale === SUPPORTED_LOCALES.EN ? 'EN' : 'RU'}
        </button>
      </div>
    </div>
  );
};
