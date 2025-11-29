/**
 * Settings Sidebar Component
 * Sidebar menu for settings navigation
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Settings, Bell, Puzzle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: Settings,
      label: t('settings.general'),
      path: '/settings',
      description: t('settings.generalDescription'),
    },
    {
      icon: Bell,
      label: t('settings.notifications'),
      path: '/settings/notifications',
      description: t('settings.notificationsDescription'),
    },
    {
      icon: Puzzle,
      label: t('settings.extension'),
      path: '/settings/extension',
      description: t('settings.extensionDescription'),
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background-primary border-l border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('settings.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-background-secondary rounded-lg transition-colors"
              title={t('common.close')}
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors mb-1 ${
                    isActive
                      ? 'bg-background-secondary text-primary'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-background-secondary'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`flex-shrink-0 mt-0.5 ${
                      isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

