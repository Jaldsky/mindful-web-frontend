/**
 * Settings Page Component
 * General application settings
 */

import React from 'react';
import { Layout } from '../../components/layout';
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts';
import { useTranslation } from '../../hooks';
import { Card, PageHeader } from '../../components/ui';

export const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

        {/* General Settings */}
        <Card noPadding className="overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 flex-shrink-0">
              <SettingsIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('settings.generalDescription')}</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="px-4 py-3 flex items-center justify-between hover:bg-background-secondary transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 flex-shrink-0">
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('settings.theme')}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {isDark ? t('settings.themeEnabled') : t('settings.themeDisabled')}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

