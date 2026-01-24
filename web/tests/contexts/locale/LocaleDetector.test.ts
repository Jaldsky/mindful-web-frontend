import { describe, it, expect, beforeEach } from 'vitest';
import { LocaleDetector } from '../../../src/contexts/locale/LocaleDetector';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../../../src/contexts/constants';

describe('LocaleDetector', () => {
  let detector: LocaleDetector;

  beforeEach(() => {
    detector = new LocaleDetector();
  });

  describe('detectBrowserLocale', () => {
    it('returns default locale when navigator is undefined', () => {
      const originalNavigator = global.navigator;
      // @ts-expect-error - Testing undefined navigator
      delete global.navigator;

      const result = detector.detectBrowserLocale();
      expect(result).toBe(DEFAULT_LOCALE);

      global.navigator = originalNavigator;
    });

    it('returns RU locale when browser language is Russian', () => {
      Object.defineProperty(global.navigator, 'language', {
        value: 'ru-RU',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(SUPPORTED_LOCALES.RU);
    });

    it('returns RU locale when browser language code is ru', () => {
      Object.defineProperty(global.navigator, 'language', {
        value: 'ru',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(SUPPORTED_LOCALES.RU);
    });

    it('returns default locale when browser language is English', () => {
      Object.defineProperty(global.navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(DEFAULT_LOCALE);
    });

    it('returns default locale when browser language is unsupported', () => {
      Object.defineProperty(global.navigator, 'language', {
        value: 'fr-FR',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(DEFAULT_LOCALE);
    });

    it('handles userLanguage property for older browsers', () => {
      const originalLanguage = global.navigator.language;
      Object.defineProperty(global.navigator, 'language', {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(global.navigator, 'userLanguage', {
        value: 'ru-RU',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(SUPPORTED_LOCALES.RU);

      Object.defineProperty(global.navigator, 'language', {
        value: originalLanguage,
        configurable: true,
      });
    });

    it('is case-insensitive for language codes', () => {
      Object.defineProperty(global.navigator, 'language', {
        value: 'RU-ru',
        configurable: true,
      });

      const result = detector.detectBrowserLocale();
      expect(result).toBe(SUPPORTED_LOCALES.RU);
    });
  });

  describe('isValidLocale', () => {
    it('returns true for EN locale', () => {
      expect(detector.isValidLocale('en')).toBe(true);
    });

    it('returns true for RU locale', () => {
      expect(detector.isValidLocale('ru')).toBe(true);
    });

    it('returns false for invalid locale', () => {
      expect(detector.isValidLocale('fr')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(detector.isValidLocale('')).toBe(false);
    });

    it('returns false for undefined', () => {
      // @ts-expect-error - Testing invalid input
      expect(detector.isValidLocale(undefined)).toBe(false);
    });

    it('returns false for null', () => {
      // @ts-expect-error - Testing invalid input
      expect(detector.isValidLocale(null)).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(detector.isValidLocale('EN')).toBe(false);
      expect(detector.isValidLocale('RU')).toBe(false);
    });
  });
});
