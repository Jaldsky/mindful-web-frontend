/**
 * Profile Page Component
 * Displays user profile information
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { useUser } from '../../contexts';
import { useTranslation, useTimezone, timezoneDetector } from '../../hooks';
import { storageManager } from '../../contexts';
import { User, Mail, Hash, Globe, Edit2, Check, X } from 'lucide-react';
import { STORAGE_KEYS } from '../../constants';

export const Profile: React.FC = () => {
  const { userId } = useUser();
  const { t } = useTranslation();
  const { timezone: detectedTimezone } = useTimezone();
  
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>('');
  
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [timezoneInput, setTimezoneInput] = useState('');

  useEffect(() => {
    const savedEmail = storageManager.getItem(STORAGE_KEYS.USER_EMAIL);
    const savedUsername = storageManager.getItem(STORAGE_KEYS.USERNAME);
    const savedTimezone = storageManager.getItem(STORAGE_KEYS.TIMEZONE);

    if (savedEmail) setEmail(savedEmail);
    if (savedUsername) setUsername(savedUsername);
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      setTimezone(detectedTimezone);
    }
  }, [detectedTimezone]);

  const handleSaveEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      storageManager.setItem(STORAGE_KEYS.USER_EMAIL, emailInput);
      setEmail(emailInput);
      setEditingEmail(false);
    }
  };

  const handleCancelEmail = () => {
    setEmailInput(email || '');
    setEditingEmail(false);
  };

  const startEditingEmail = () => {
    setEmailInput(email || '');
    setEditingEmail(true);
  };

  const handleSaveTimezone = () => {
    if (timezoneInput) {
      storageManager.setItem(STORAGE_KEYS.TIMEZONE, timezoneInput);
      setTimezone(timezoneInput);
      setEditingTimezone(false);
    }
  };

  const handleCancelTimezone = () => {
    setTimezoneInput(timezone);
    setEditingTimezone(false);
  };

  const startEditingTimezone = () => {
    setTimezoneInput(timezone);
    setEditingTimezone(true);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Layout>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {t('profile.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('profile.subtitle')}
          </p>
        </div>

        <div className="bg-background-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {/* User ID */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 flex-shrink-0">
              <Hash size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('profile.userId')}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white break-all font-mono mt-0.5">
                {userId || '—'}
              </p>
            </div>
            {userId && (
              <button
                onClick={() => handleCopyToClipboard(userId)}
                className="p-1 hover:bg-background-secondary rounded transition-colors flex-shrink-0"
                title={t('common.copy')}
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Username */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('profile.username')}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                {username || email?.split('@')[0] || '—'}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
              <Mail size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('profile.email')}</p>
              {editingEmail ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-primary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('profile.enterEmail')}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    title={t('common.save')}
                  >
                    <Check size={14} className="text-green-600 dark:text-green-400" />
                  </button>
                  <button
                    onClick={handleCancelEmail}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title={t('common.cancel')}
                  >
                    <X size={14} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                    {email || '—'}
                  </p>
                  <button
                    onClick={startEditingEmail}
                    className="p-1 hover:bg-background-secondary rounded transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit2 size={12} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {email && (
                    <button
                      onClick={() => handleCopyToClipboard(email)}
                      className="p-1 hover:bg-background-secondary rounded transition-colors"
                      title={t('common.copy')}
                    >
                      <svg
                        className="w-3 h-3 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400 flex-shrink-0">
              <Globe size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{t('profile.timezone')}</p>
              {editingTimezone ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <select
                    value={timezoneInput}
                    onChange={(e) => setTimezoneInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-primary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  >
                    {timezoneDetector.getSupportedTimezones().map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveTimezone}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    title={t('common.save')}
                  >
                    <Check size={14} className="text-green-600 dark:text-green-400" />
                  </button>
                  <button
                    onClick={handleCancelTimezone}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title={t('common.cancel')}
                  >
                    <X size={14} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {timezone ? timezoneDetector.formatTimezoneWithOffset(timezone) : '—'}
                  </p>
                  <button
                    onClick={startEditingTimezone}
                    className="p-1 hover:bg-background-secondary rounded transition-colors"
                    title={t('common.edit')}
                  >
                    <Edit2 size={12} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
