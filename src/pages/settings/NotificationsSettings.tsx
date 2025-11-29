/**
 * Notifications Settings Component
 * Settings for browser and email notifications
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Bell } from 'lucide-react';
import { STORAGE_KEYS } from '../../constants';

export const NotificationsSettings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    const savedEmailNotifications = localStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS);
    
    if (savedNotifications === 'true') setNotificationsEnabled(true);
    if (savedEmailNotifications === 'true') setEmailNotifications(true);
  }, []);

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled.toString());
  };

  const handleEmailNotificationsToggle = (enabled: boolean) => {
    setEmailNotifications(enabled);
    localStorage.setItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS, enabled.toString());
  };

  return (
    <Layout>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Настройки уведомлений
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Управление уведомлениями браузера и email
          </p>
        </div>

        <div className="bg-background-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 flex-shrink-0">
              <Bell size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Настройки уведомлений</p>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center justify-between hover:bg-background-secondary transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Уведомления браузера</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  Получать уведомления в браузере
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationsToggle(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                notificationsEnabled
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between hover:bg-background-secondary transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Email уведомления</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  Получать уведомления на email
                </p>
              </div>
            </div>
            <button
              onClick={() => handleEmailNotificationsToggle(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                emailNotifications
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

