import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimezoneDetector, timezoneDetector } from '../../../src/hooks/utils/TimezoneDetector';

describe('TimezoneDetector', () => {
  let detector: TimezoneDetector;

  beforeEach(() => {
    detector = new TimezoneDetector();
  });

  describe('detectTimezone', () => {
    it('returns detected timezone from Intl API', () => {
      const timezone = detector.detectTimezone();
      expect(typeof timezone).toBe('string');
      expect(timezone.length).toBeGreaterThan(0);
    });

    it('returns UTC on error', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      
      vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
        throw new Error('DateTimeFormat error');
      });

      const timezone = detector.detectTimezone();
      expect(timezone).toBe('UTC');

      Intl.DateTimeFormat = originalDateTimeFormat;
    });

    it('returns valid timezone format', () => {
      const timezone = detector.detectTimezone();
      // Timezone should be in format like "America/New_York" or "UTC"
      expect(timezone).toMatch(/^[A-Za-z_]+(\/?[A-Za-z_]+)*$/);
    });
  });

  describe('getTimezoneOffset', () => {
    it('returns offset string', () => {
      const offset = detector.getTimezoneOffset('America/New_York');
      expect(typeof offset).toBe('string');
    });

    it('returns empty string on error', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const offset = detector.getTimezoneOffset('Invalid/Timezone');
      expect(offset).toBe('');

      consoleWarnSpy.mockRestore();
    });

    it('uses detected timezone when no timezone provided', () => {
      const offset = detector.getTimezoneOffset();
      expect(typeof offset).toBe('string');
    });

    it('returns GMT format offset', () => {
      const offset = detector.getTimezoneOffset('America/New_York');
      // Should be like "EST", "EDT", "GMT-5", etc.
      expect(offset.length).toBeGreaterThan(0);
    });
  });

  describe('formatTimezoneWithOffset', () => {
    it('formats timezone with offset', () => {
      const formatted = detector.formatTimezoneWithOffset('America/New_York');
      expect(formatted).toContain('America/New_York');
      expect(formatted).toContain('(');
      expect(formatted).toContain(')');
    });

    it('returns em dash for empty timezone', () => {
      const formatted = detector.formatTimezoneWithOffset('');
      expect(formatted).toBe('—');
    });

    it('returns timezone without offset if offset is empty', () => {
      vi.spyOn(detector, 'getTimezoneOffset').mockReturnValue('');
      
      const formatted = detector.formatTimezoneWithOffset('UTC');
      expect(formatted).toBe('UTC');
    });

    it('formats correctly with valid offset', () => {
      vi.spyOn(detector, 'getTimezoneOffset').mockReturnValue('GMT-5');
      
      const formatted = detector.formatTimezoneWithOffset('America/New_York');
      expect(formatted).toBe('America/New_York (GMT-5)');
    });
  });

  describe('error handling', () => {
    it('handles Intl API errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const originalDateTimeFormat = Intl.DateTimeFormat;
      
      vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
        throw new Error('Intl error');
      });

      const timezone = detector.detectTimezone();
      expect(timezone).toBe('UTC');
      expect(consoleWarnSpy).toHaveBeenCalled();

      Intl.DateTimeFormat = originalDateTimeFormat;
      consoleWarnSpy.mockRestore();
    });

    it('handles toLocaleString errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const offset = detector.getTimezoneOffset('Invalid/Timezone');
      expect(offset).toBe('');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });
});

describe('timezoneDetector singleton', () => {
  it('is an instance of TimezoneDetector', () => {
    expect(timezoneDetector).toBeInstanceOf(TimezoneDetector);
  });

  it('can detect timezone', () => {
    const timezone = timezoneDetector.detectTimezone();
    expect(typeof timezone).toBe('string');
  });

  it('can get timezone offset', () => {
    const offset = timezoneDetector.getTimezoneOffset();
    expect(typeof offset).toBe('string');
  });

  it('can format timezone with offset', () => {
    const formatted = timezoneDetector.formatTimezoneWithOffset('UTC');
    expect(typeof formatted).toBe('string');
  });
});
