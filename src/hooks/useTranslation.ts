/**
 * Translation hook
 * Provides translation function for current locale
 */

import { useMemo } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { en } from '../locales/en';
import { ru } from '../locales/ru';

const translations = {
  en,
  ru,
};

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key] as Record<string, unknown> | string | undefined;
    }
    return undefined;
  }, obj as Record<string, unknown> | undefined) as string | undefined;
}

export function useTranslation() {
  const { locale } = useLocale();

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      try {
        const localeTranslations = translations[locale];
        if (!localeTranslations) {
          console.warn(`Locale ${locale} not found, using default`);
          const translation = getNestedValue(translations.en, key);
          if (!translation || typeof translation !== 'string') {
            return key;
          }
          return translation;
        }

        const translation = getNestedValue(localeTranslations, key);
        
        if (!translation || typeof translation !== 'string') {
          console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
          // Fallback to English
          const enTranslation = getNestedValue(translations.en, key);
          if (enTranslation && typeof enTranslation === 'string') {
            return enTranslation;
          }
          return key;
        }

        if (params) {
          return Object.entries(params).reduce(
            (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, String(paramValue)),
            translation
          );
        }

        return translation;
      } catch (error) {
        console.error('Translation error:', error);
        return key;
      }
    };
  }, [locale]);

  return { t, locale };
}

