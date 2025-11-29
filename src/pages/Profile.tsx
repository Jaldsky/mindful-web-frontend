/**
 * Profile Page Component
 * Displays user profile information
 */

import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useUser } from '../contexts/UserContext';
import { User, Mail, Hash, Globe, Edit2, Check, X } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';

export const Profile: React.FC = () => {
  const { userId } = useUser();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [timezoneInput, setTimezoneInput] = useState('');

  useEffect(() => {
    // Load saved email and username from localStorage
    const savedEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    const savedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
    const savedTimezone = localStorage.getItem(STORAGE_KEYS.TIMEZONE);

    if (savedEmail) setEmail(savedEmail);
    if (savedUsername) setUsername(savedUsername);

    // Get timezone from localStorage or browser
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
      localStorage.setItem(STORAGE_KEYS.TIMEZONE, tz);
    }
  }, []);

  const getTimezoneOffset = (tz?: string): string => {
    const tzToUse = tz || timezone;
    if (!tzToUse) return '';
    
    try {
      const date = new Date();
      
      // Method 1: Use Intl.DateTimeFormat with timeZoneName
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: tzToUse,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(date);
      const offsetPart = parts.find(part => part.type === 'timeZoneName');
      
      if (offsetPart && offsetPart.value) {
        const offsetStr = offsetPart.value.replace('GMT', 'UTC');
        if (offsetStr.startsWith('UTC')) {
          return offsetStr;
        }
      }
      
      // Method 2: Calculate offset by comparing UTC and timezone times
      const utcFormatter = new Intl.DateTimeFormat('en', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      const tzFormatter = new Intl.DateTimeFormat('en', {
        timeZone: tzToUse,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      const utcTime = utcFormatter.format(date);
      const tzTime = tzFormatter.format(date);
      
      const [utcHours, utcMinutes] = utcTime.split(':').map(Number);
      const [tzHours, tzMinutes] = tzTime.split(':').map(Number);
      
      const utcTotalMinutes = utcHours * 60 + utcMinutes;
      let tzTotalMinutes = tzHours * 60 + tzMinutes;
      
      // Handle day boundary
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tzToUse }));
      const dayDiff = Math.round((tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60 * 24));
      tzTotalMinutes += dayDiff * 24 * 60;
      
      let diffMinutes = tzTotalMinutes - utcTotalMinutes;
      
      // Normalize to -12 to +14 hours range
      while (diffMinutes > 14 * 60) diffMinutes -= 24 * 60;
      while (diffMinutes < -12 * 60) diffMinutes += 24 * 60;
      
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const minutes = Math.abs(diffMinutes) % 60;
      const sign = diffMinutes >= 0 ? '+' : '-';
      
      return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const getTimezones = (): string[] => {
    try {
      // Use Intl.supportedValuesOf if available (modern browsers)
      const intlWithSupportedValues = Intl as typeof Intl & {
        supportedValuesOf?: (key: 'timeZone') => string[];
      };
      if (typeof intlWithSupportedValues.supportedValuesOf === 'function') {
        return intlWithSupportedValues.supportedValuesOf('timeZone').sort();
      }
    } catch {
      // Fallback to common timezones
    }
    
    // Fallback list of common timezones
    return [
      'Europe/Moscow',
      'Europe/Kiev',
      'Europe/Minsk',
      'Europe/Warsaw',
      'Europe/Berlin',
      'Europe/Paris',
      'Europe/London',
      'Europe/Rome',
      'Europe/Madrid',
      'Europe/Athens',
      'Europe/Istanbul',
      'Asia/Dubai',
      'Asia/Tashkent',
      'Asia/Almaty',
      'Asia/Baku',
      'Asia/Yerevan',
      'Asia/Tbilisi',
      'Asia/Tehran',
      'Asia/Karachi',
      'Asia/Kolkata',
      'Asia/Dhaka',
      'Asia/Bangkok',
      'Asia/Shanghai',
      'Asia/Tokyo',
      'Asia/Seoul',
      'Asia/Hong_Kong',
      'Asia/Singapore',
      'Australia/Sydney',
      'Australia/Melbourne',
      'Australia/Perth',
      'Pacific/Auckland',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Toronto',
      'America/Mexico_City',
      'America/Sao_Paulo',
      'America/Buenos_Aires',
      'Africa/Cairo',
      'Africa/Johannesburg',
      'UTC',
    ].sort();
  };

  const handleSaveEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, emailInput);
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
      localStorage.setItem(STORAGE_KEYS.TIMEZONE, timezoneInput);
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

  return (
    <Layout>
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Личная информация
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Управление вашим профилем и настройками
          </p>
        </div>

        <div className="bg-background-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {/* User ID */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 flex-shrink-0">
              <Hash size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Идентификатор пользователя</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white break-all font-mono mt-0.5">
                {userId || '—'}
              </p>
            </div>
            {userId && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(userId);
                }}
                className="p-1 hover:bg-background-secondary rounded transition-colors flex-shrink-0"
                title="Копировать"
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
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 flex-shrink-0">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Логин</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                {username || email?.split('@')[0] || '—'}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-background-secondary transition-colors">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 flex-shrink-0">
              <Mail size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Email</p>
              {editingEmail ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-primary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Введите email"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    title="Сохранить"
                  >
                    <Check size={14} className="text-green-600" />
                  </button>
                  <button
                    onClick={handleCancelEmail}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Отмена"
                  >
                    <X size={14} className="text-red-600" />
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
                    title="Редактировать"
                  >
                    <Edit2 size={12} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {email && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(email);
                      }}
                      className="p-1 hover:bg-background-secondary rounded transition-colors"
                      title="Копировать"
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
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 flex-shrink-0">
              <Globe size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Часовой пояс</p>
              {editingTimezone ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <select
                    value={timezoneInput}
                    onChange={(e) => setTimezoneInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-primary text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  >
                    {getTimezones().map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveTimezone}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                    title="Сохранить"
                  >
                    <Check size={14} className="text-green-600" />
                  </button>
                  <button
                    onClick={handleCancelTimezone}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Отмена"
                  >
                    <X size={14} className="text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {timezone ? `${timezone} (${getTimezoneOffset()})` : '—'}
                  </p>
                  <button
                    onClick={startEditingTimezone}
                    className="p-1 hover:bg-background-secondary rounded transition-colors"
                    title="Редактировать"
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

