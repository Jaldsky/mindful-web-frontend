import React, { useEffect, useState, useCallback } from 'react';
import { LocaleContext } from '../contexts';
import { storageManager } from '../utils';
import { localeDetector } from './LocaleDetector';
import { SUPPORTED_LOCALES, type Locale } from '../constants';
import { STORAGE_KEYS } from '../../constants';
import type { LocaleContextType } from '../types';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = storageManager.getItem(STORAGE_KEYS.LOCALE);
    if (stored && localeDetector.isValidLocale(stored)) {
      return stored;
    }
    return localeDetector.detectBrowserLocale();
  });

  useEffect(() => {
    storageManager.setItem(STORAGE_KEYS.LOCALE, locale);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === SUPPORTED_LOCALES.EN || newLocale === SUPPORTED_LOCALES.RU) {
      setLocaleState(newLocale);
    }
  }, []);

  const detectBrowserLocale = useCallback(() => {
    return localeDetector.detectBrowserLocale();
  }, []);

  const value: LocaleContextType = {
    locale,
    setLocale,
    detectBrowserLocale,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
