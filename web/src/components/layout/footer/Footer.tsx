/**
 * Footer Component
 * Application footer with copyright and links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks';

const linkStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};

const handleMouseEnter = (e: React.MouseEvent) => {
  (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
};

const handleMouseLeave = (e: React.MouseEvent) => {
  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
};

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--color-bg-primary)',
        padding: 'var(--spacing-lg) 0',
      }}
    >
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <Link
            to="/terms"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t('footer.terms')}
          </Link>

          <span style={{ color: 'var(--color-text-light)' }}>•</span>

          <Link
            to="/privacy"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t('footer.privacy')}
          </Link>

          <span style={{ color: 'var(--color-text-light)' }}>•</span>

          <a
            href="https://github.com/Jaldsky/mindful-web-frontend/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t('footer.reportBug')}
          </a>
        </div>

        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          © {currentYear} Mindful Web
        </span>
      </div>
    </footer>
  );
};
