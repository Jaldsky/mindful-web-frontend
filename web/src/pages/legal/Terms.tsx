/**
 * Terms of Service Page
 */

import React from 'react';
import { Layout } from '../../components/layout';
import { Card } from '../../components/ui';
import { useTranslation } from '../../hooks';

export const Terms: React.FC = () => {
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
          {t('legal.terms.title')}
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
              {t('legal.terms.acceptance.title')}
            </h2>
            <p>{t('legal.terms.acceptance.content')}</p>
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
              {t('legal.terms.service.title')}
            </h2>
            <p>{t('legal.terms.service.content')}</p>
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
              {t('legal.terms.usage.title')}
            </h2>
            <p>{t('legal.terms.usage.content')}</p>
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
              {t('legal.terms.changes.title')}
            </h2>
            <p>{t('legal.terms.changes.content')}</p>
          </section>
        </div>
      </Card>
    </Layout>
  );
};
