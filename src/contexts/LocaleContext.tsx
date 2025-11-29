/**
 * Locale Context
 * Manages locale state (ru/en)
 * Following React Context pattern
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

export const SUPPORTED_LOCALES = {
  EN: 'en',
  RU: 'ru',
} as const;

export type Locale = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES];

const DEFAULT_LOCALE: Locale = SUPPORTED_LOCALES.EN;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  detectBrowserLocale: () => Locale;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      // Check localStorage first
      const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
      if (stored && (stored === SUPPORTED_LOCALES.EN || stored === SUPPORTED_LOCALES.RU)) {
        return stored as Locale;
      }
      
      // Detect browser locale
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language || 
          ('userLanguage' in navigator ? (navigator as { userLanguage: string }).userLanguage : null);
        if (browserLang) {
          const langCode = browserLang.substring(0, 2).toLowerCase();
          if (langCode === SUPPORTED_LOCALES.RU) {
            return SUPPORTED_LOCALES.RU;
          }
        }
      }
    } catch (error) {
      console.warn('Error initializing locale:', error);
    }
    
    return DEFAULT_LOCALE;
  });

  const detectBrowserLocale = useCallback((): Locale => {
    const browserLang = navigator.language || 
      ('userLanguage' in navigator ? (navigator as { userLanguage: string }).userLanguage : null);
    if (browserLang) {
      const langCode = browserLang.substring(0, 2).toLowerCase();
      if (langCode === SUPPORTED_LOCALES.RU) {
        return SUPPORTED_LOCALES.RU;
      }
    }
    return DEFAULT_LOCALE;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', locale);
      }
    } catch (error) {
      console.warn('Error saving locale:', error);
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === SUPPORTED_LOCALES.EN || newLocale === SUPPORTED_LOCALES.RU) {
      setLocaleState(newLocale);
    }
  }, []);

  const value: LocaleContextType = {
    locale,
    setLocale,
    detectBrowserLocale,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

