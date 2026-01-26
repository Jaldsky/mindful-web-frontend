/**
 * Privacy Policy Page
 */

import React from 'react';
import { Layout } from '../../components/layout';
import { Card } from '../../components/ui';
import { useTranslation } from '../../hooks';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Card>
        <h1
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {t('legal.privacy.title')}
        </h1>

        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
          }}
        >
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              {t('legal.privacy.collection.title')}
            </h2>
            <p>{t('legal.privacy.collection.content')}</p>
          </section>

          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              {t('legal.privacy.usage.title')}
            </h2>
            <p>{t('legal.privacy.usage.content')}</p>
          </section>

          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              {t('legal.privacy.storage.title')}
            </h2>
            <p>{t('legal.privacy.storage.content')}</p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              {t('legal.privacy.rights.title')}
            </h2>
            <p>{t('legal.privacy.rights.content')}</p>
          </section>
        </div>
      </Card>
    </Layout>
  );
};
