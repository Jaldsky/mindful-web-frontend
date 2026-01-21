/**
 * Auth Header Component
 * Theme and locale switchers for auth screens
 */

import React from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { useLocale } from '../../../contexts';
import { useTheme } from '../../../contexts';
import { THEME } from '../../../constants';

export const AuthHeader: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ru' : 'en');
  };

  return (
    <div
      className="flex gap-2 mb-6"
      style={{
        justifyContent: 'flex-end',
      }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{
          color: 'var(--color-text-secondary)',
        }}
        aria-label="Toggle theme"
      >
        {theme === THEME.LIGHT ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <button
        type="button"
        onClick={toggleLocale}
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
        style={{
          color: 'var(--color-text-secondary)',
        }}
        aria-label="Change language"
      >
        <Globe size={20} />
        <span className="text-sm font-medium uppercase">{locale}</span>
      </button>
    </div>
  );
};
