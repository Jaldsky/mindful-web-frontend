/**
 * Extension Section Component
 * Browser extension download section
 */

import React from 'react';
import { Activity, Chrome, Download, Zap } from 'lucide-react';
import { Card } from '../../ui';
import { useTranslation } from '../../../hooks';
import { SectionHeader } from '../layout';
import { ExtensionButton } from '../controls';
import { EXTENSION_URLS, SECTION_COLORS } from '../constants';

interface ExtensionSectionProps {
  isVisible: boolean;
}

export const ExtensionSection: React.FC<ExtensionSectionProps> = ({ isVisible }) => {
  const { t } = useTranslation();

  return (
    <Card
      noPadding
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease 200ms, transform 0.4s ease 200ms',
      }}
    >
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <SectionHeader
          icon={<Download size={16} />}
          title={t('home.sections.extension')}
          color={SECTION_COLORS.extension}
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
          {t('home.extension.description')}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <ExtensionButton
            browser="Chrome"
            icon={<Chrome size={20} />}
            available
            href={EXTENSION_URLS.chrome}
          />
          <ExtensionButton
            browser="Firefox"
            icon={<Zap size={20} />}
            available={false}
          />
          <ExtensionButton
            browser="Edge"
            icon={<Activity size={20} />}
            available={false}
          />

          <div
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              flex: 1,
              minWidth: 140,
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              100+
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {t('home.extension.users')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
