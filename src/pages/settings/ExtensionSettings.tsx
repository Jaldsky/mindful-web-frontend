/**
 * Extension Settings Component
 * Browser extension management
 */

import React from 'react';
import { Layout } from '../../components/Layout';
import { Puzzle } from 'lucide-react';

export const ExtensionSettings: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Управление расширением браузера
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Информация об установке и использовании расширения
          </p>
        </div>

        <div className="bg-background-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg text-indigo-600 flex-shrink-0">
              <Puzzle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Управление расширением браузера</p>
            </div>
          </div>

          <div className="px-4 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Для отслеживания активности в браузере необходимо установить расширение Mindful Web.
            </p>
            <div className="space-y-3">
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Puzzle size={16} />
                Установить расширение Chrome
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                После установки расширение автоматически начнет отслеживать вашу активность и отправлять данные на сервер.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

