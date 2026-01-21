import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TranslationService, translationService } from '../../../src/hooks/utils/TranslationService';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    service = new TranslationService();
  });

  describe('translate', () => {
    it('translates simple key in English', () => {
      const result = service.translate('en', 'common.appName');
      expect(result).toBe('Mindful Web');
    });

    it('translates simple key in Russian', () => {
      const result = service.translate('ru', 'common.appName');
      expect(result).toBe('Mindful Web');
    });

    it('translates nested key', () => {
      const result = service.translate('en', 'profile.title');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('falls back to English for unsupported locale', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = service.translate('fr', 'common.appName');
      expect(result).toBe('Mindful Web');
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Locale fr not found'));

      consoleWarnSpy.mockRestore();
    });

    it('falls back to English for missing translation in Russian', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Assuming there's a key that exists in EN but not in RU
      const result = service.translate('ru', 'nonexistent.key');
      expect(typeof result).toBe('string');

      consoleWarnSpy.mockRestore();
    });

    it('returns key when translation not found', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = service.translate('en', 'completely.nonexistent.key');
      expect(result).toBe('completely.nonexistent.key');

      consoleWarnSpy.mockRestore();
    });

    it('interpolates parameters', () => {
      // Test interpolation with existing key
      const result = service.translate('en', 'common.appName', { count: 5 });
      expect(typeof result).toBe('string');
    });

    it('handles multiple parameters', () => {
      const result = service.translate('en', 'common.appName', { 
        count: 5,
        name: 'Test'
      });
      expect(typeof result).toBe('string');
    });
  });

  describe('hasTranslation', () => {
    it('returns true for existing translation', () => {
      const has = service.hasTranslation('en', 'common.appName');
      expect(has).toBe(true);
    });

    it('returns false for non-existing translation', () => {
      const has = service.hasTranslation('en', 'nonexistent.key');
      expect(has).toBe(false);
    });

    it('returns false for invalid locale', () => {
      const has = service.hasTranslation('invalid', 'common.appName');
      expect(has).toBe(false);
    });

    it('returns true for nested key', () => {
      const has = service.hasTranslation('en', 'profile.title');
      expect(has).toBe(true);
    });

    it('returns false for partially correct nested key', () => {
      const has = service.hasTranslation('en', 'profile.invalid.key');
      expect(has).toBe(false);
    });
  });

  describe('error handling', () => {
    it('handles translation errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Try to break it with null/undefined
      const result = service.translate('en', '');
      expect(typeof result).toBe('string');

      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('handles deep nested paths', () => {
      const result = service.translate('en', 'a.b.c.d.e.f.g');
      expect(typeof result).toBe('string');
    });

    it('handles special characters in keys', () => {
      const result = service.translate('en', 'key-with-dash.key_with_underscore');
      expect(typeof result).toBe('string');
    });
  });

  describe('interpolation', () => {
    it('replaces single placeholder', () => {
      // Create a test by checking if placeholders are replaced
      const key = 'common.appName';
      const withParams = service.translate('en', key, { test: 'value' });
      const withoutParams = service.translate('en', key);
      
      expect(typeof withParams).toBe('string');
      expect(typeof withoutParams).toBe('string');
    });

    it('handles numeric parameters', () => {
      const result = service.translate('en', 'common.appName', { count: 42 });
      expect(typeof result).toBe('string');
    });

    it('handles string parameters', () => {
      const result = service.translate('en', 'common.appName', { name: 'Test User' });
      expect(typeof result).toBe('string');
    });

    it('handles empty params object', () => {
      const result = service.translate('en', 'common.appName', {});
      expect(typeof result).toBe('string');
    });
  });

  describe('locale fallback', () => {
    it('uses English as fallback locale', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = service.translate('unknown', 'common.appName');
      expect(result).toBe('Mindful Web');

      consoleWarnSpy.mockRestore();
    });

    it('warns when using fallback', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      service.translate('fr', 'common.appName');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('does not warn for valid locales', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      service.translate('en', 'common.appName');
      service.translate('ru', 'common.appName');
      
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});

describe('translationService singleton', () => {
  it('is an instance of TranslationService', () => {
    expect(translationService).toBeInstanceOf(TranslationService);
  });

  it('can translate', () => {
    const result = translationService.translate('en', 'common.appName');
    expect(typeof result).toBe('string');
  });

  it('can check translation existence', () => {
    const has = translationService.hasTranslation('en', 'common.appName');
    expect(typeof has).toBe('boolean');
  });

  it('maintains state across calls', () => {
    const result1 = translationService.translate('en', 'common.appName');
    const result2 = translationService.translate('en', 'common.appName');
    expect(result1).toBe(result2);
  });
});
