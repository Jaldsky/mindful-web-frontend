/**
 * Features Section Component
 * Displays feature cards with section header
 */

import React from 'react';
import { Activity, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card } from '../../ui';
import { useTranslation } from '../../../hooks';
import { SectionHeader } from '../layout';
import { FeatureCard } from '../cards';
import { FEATURE_COLORS, SECTION_COLORS } from '../constants';

interface FeaturesSectionProps {
  isVisible: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ isVisible }) => {
  const { t } = useTranslation();

  return (
    <Card
      noPadding
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease 100ms, transform 0.4s ease 100ms',
      }}
    >
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <SectionHeader
          icon={<Sparkles size={16} />}
          title={t('home.sections.features')}
          color={SECTION_COLORS.features}
        />
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {t('home.sections.featuresDescription')}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          <FeatureCard
            icon={<Clock size={20} />}
            title={t('home.features.tracking.title')}
            description={t('home.features.tracking.description')}
            color={FEATURE_COLORS.blue}
          />
          <FeatureCard
            icon={<TrendingUp size={20} />}
            title={t('home.features.analytics.title')}
            description={t('home.features.analytics.description')}
            color={FEATURE_COLORS.green}
          />
          <FeatureCard
            icon={<Activity size={20} />}
            title={t('home.features.mindful.title')}
            description={t('home.features.mindful.description')}
            color={FEATURE_COLORS.purple}
          />
        </div>
      </div>
    </Card>
  );
};
