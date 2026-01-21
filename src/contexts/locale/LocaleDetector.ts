import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from '../constants';

/**
 * Locale Detector
 * Handles browser locale detection
 * Follows Single Responsibility Principle
 */
export class LocaleDetector {
  detectBrowserLocale(): Locale {
    if (typeof navigator === 'undefined') {
      return DEFAULT_LOCALE;
    }

    const browserLang = navigator.language || 
      ('userLanguage' in navigator ? (navigator as { userLanguage: string }).userLanguage : null);
    
    if (browserLang) {
      const langCode = browserLang.substring(0, 2).toLowerCase();
      if (langCode === SUPPORTED_LOCALES.RU) {
        return SUPPORTED_LOCALES.RU;
      }
    }
    
    return DEFAULT_LOCALE;
  }

  isValidLocale(locale: string): locale is Locale {
    return locale === SUPPORTED_LOCALES.EN || locale === SUPPORTED_LOCALES.RU;
  }
}

export const localeDetector = new LocaleDetector();
