/**
 * Home Page Component
 * Main landing page displayed at root path (/)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../hooks';
import { Button, Card, PageHeader } from '../../components/ui';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <PageHeader
              title={t('common.appName')}
              subtitle={t('home.subtitle')}
              right={null}
            />

            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="inline-flex">
                <Button>
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 size={18} />
                    {t('home.viewDashboard')}
                  </span>
                </Button>
              </Link>
              <div
                className="hidden sm:flex items-center gap-2"
                style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}
              >
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Activity size={16} style={{ color: 'var(--color-primary)' }} />
                </span>
                <span>Mindful insights, less noise</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="p-6" noPadding>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {t('welcome.title')}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {t('welcome.subtitle')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 w-fit">
                    <Clock size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {t('home.features.tracking.title')}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {t('home.features.tracking.description')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 w-fit">
                    <TrendingUp size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {t('home.features.analytics.title')}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {t('home.features.analytics.description')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 w-fit">
                    <Activity size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {t('home.features.mindful.title')}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {t('home.features.mindful.description')}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </Layout>
  );
};
