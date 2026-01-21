/**
 * Translation Service
 * Handles translation logic with fallbacks and nested keys
 * Follows Single Responsibility Principle
 */

import { en } from '../../locales/en';
import { ru } from '../../locales/ru';

type Translations = {
  en: typeof en;
  ru: typeof ru;
};

type LocaleKey = keyof Translations;

export class TranslationService {
  private readonly translations: Translations = {
    en,
    ru,
  };

  private readonly defaultLocale: LocaleKey = 'en';

  /**
   * Get nested value from object by dot-separated path
   */
  private getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  }

  /**
   * Replace placeholders in translation string with params
   */
  private interpolate(translation: string, params: Record<string, string | number>): string {
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replace(`{${key}}`, String(value)),
      translation
    );
  }

  /**
   * Get translation for key in specified locale with fallback
   */
  translate(locale: string, key: string, params?: Record<string, string | number>): string {
    try {
      if (!(locale in this.translations)) {
        console.warn(`Locale ${locale} not found, using ${this.defaultLocale}`);
        return this.translateWithFallback(this.defaultLocale, key, params);
      }

      return this.translateWithFallback(locale as LocaleKey, key, params);
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  }

  /**
   * Translate with fallback to default locale
   */
  private translateWithFallback(
    locale: LocaleKey,
    key: string,
    params?: Record<string, string | number>
  ): string {
    const localeTranslations = this.translations[locale];
    const translation = this.getNestedValue(localeTranslations, key);

    if (translation) {
      return params ? this.interpolate(translation, params) : translation;
    }

    if (locale !== this.defaultLocale) {
      console.warn(`Translation missing for key: ${key} in locale: ${locale}, using fallback`);
      const fallbackTranslation = this.getNestedValue(this.translations[this.defaultLocale], key);
      
      if (fallbackTranslation) {
        return params ? this.interpolate(fallbackTranslation, params) : fallbackTranslation;
      }
    }

    console.warn(`Translation missing for key: ${key} in all locales`);
    return key;
  }

  /**
   * Check if translation exists for key in locale
   */
  hasTranslation(locale: string, key: string): boolean {
    if (!(locale in this.translations)) {
      return false;
    }

    const translation = this.getNestedValue(this.translations[locale as LocaleKey], key);
    return translation !== undefined;
  }
}

export const translationService = new TranslationService();
