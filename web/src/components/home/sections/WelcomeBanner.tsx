/**
 * Welcome Banner Component
 * Hero section with animated gradient border
 */

import React from 'react';
import { Card } from '../../ui';
import { useTranslation } from '../../../hooks';
import { GRADIENT_COLORS } from '../constants';

interface WelcomeBannerProps {
  isVisible: boolean;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ isVisible }) => {
  const { t } = useTranslation();

  return (
    <Card
      noPadding
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 4,
          background: GRADIENT_COLORS.welcome,
          backgroundSize: '300% 100%',
          animation: 'gradientMove 10s ease infinite',
        }}
      />
      <div
        style={{
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'clamp(20px, 2.5vw, 26px)',
            fontWeight: 600,
            lineHeight: 1.3,
            margin: 0,
            marginBottom: 'var(--spacing-xs)',
          }}
        >
          {t('home.title')}{' '}
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('home.titleBrand')}
          </span>
        </h1>
        <p
          style={{
            color: 'var(--color-text-light)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {t('home.subtitle')}
        </p>
      </div>
    </Card>
  );
};
