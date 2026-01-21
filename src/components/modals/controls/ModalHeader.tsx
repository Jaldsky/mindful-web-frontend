import React from 'react';
import { ModalHeaderProps } from '../types';
import { MODAL_STYLES } from '../constants';
import { ModalToggleButton } from './ModalToggleButton';

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  onToggleTheme,
  onToggleLocale,
  themeIcon,
  themeTitle,
  localeIcon,
  localeTitle,
}) => {
  return (
    <>
      {/* Theme and Language Toggles */}
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
          onClick={onToggleTheme}
          title={themeTitle}
        />
        <ModalToggleButton
          icon={localeIcon}
          onClick={onToggleLocale}
          title={localeTitle}
        />
      </div>

      {/* Logo and Title */}
      <div
        className="text-center mb-8"
        style={{
          transition: 'opacity 0.3s ease',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        <h2
          className="font-bold mb-4"
          style={{
            fontSize: MODAL_STYLES.TITLE.fontSize,
            color: 'var(--color-primary)',
            marginBottom: 'var(--spacing-xl)',
            lineHeight: MODAL_STYLES.TITLE.lineHeight,
          }}
        >
          {title}
        </h2>
        <p
          className="leading-relaxed mb-4"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: '1.5',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {subtitle}
        </p>
      </div>
    </>
  );
};
