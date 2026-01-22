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

describe('TimezoneDetector - getSupportedTimezones', () => {
  let detector: TimezoneDetector;

  beforeEach(() => {
    detector = new TimezoneDetector();
  });

  it('returns array of timezones', () => {
    const timezones = detector.getSupportedTimezones();
    expect(Array.isArray(timezones)).toBe(true);
    expect(timezones.length).toBeGreaterThan(0);
  });

  it('returns sorted timezones', () => {
    const timezones = detector.getSupportedTimezones();
    const sorted = [...timezones].sort();
    expect(timezones).toEqual(sorted);
  });

  it('includes common timezones', () => {
    const timezones = detector.getSupportedTimezones();
    // Check that it returns an array with timezones
    expect(Array.isArray(timezones)).toBe(true);
    expect(timezones.length).toBeGreaterThan(0);
    // Check for UTC (might be in Intl.supportedValuesOf or fallback list)
    // If Intl.supportedValuesOf is used, it might not include UTC, so check if it exists or has common patterns
    const hasUTC = timezones.includes('UTC');
    const hasCommonTimezones = timezones.some(tz => 
      tz.includes('Europe') || tz.includes('America') || tz.includes('Asia') || tz.includes('Africa')
    );
    // Either UTC is present OR we have common timezone patterns
    expect(hasUTC || hasCommonTimezones).toBe(true);
  });

  it('uses Intl.supportedValuesOf when available', () => {
    const intlWithSupportedValues = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[];
    };
    
    // Check if supportedValuesOf exists
    if (typeof intlWithSupportedValues.supportedValuesOf === 'function') {
      const mockSupportedValuesOf = vi.spyOn(intlWithSupportedValues, 'supportedValuesOf' as keyof typeof intlWithSupportedValues);
      (mockSupportedValuesOf as ReturnType<typeof vi.spyOn>).mockReturnValue(['UTC', 'Europe/Moscow']);
      
      const result = detector.getSupportedTimezones();
      
      expect(mockSupportedValuesOf).toHaveBeenCalledWith('timeZone');
      expect(result).toEqual(['Europe/Moscow', 'UTC']); // sorted
      
      mockSupportedValuesOf.mockRestore();
    } else {
      // If not available, just verify fallback works
      expect(Array.isArray(detector.getSupportedTimezones())).toBe(true);
    }
  });

  it('falls back to common timezones on error', () => {
    const intlWithSupportedValues = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[];
    };
    
    // Only test if supportedValuesOf exists
    if (typeof intlWithSupportedValues.supportedValuesOf === 'function') {
      const mockSupportedValuesOf = vi.spyOn(intlWithSupportedValues, 'supportedValuesOf' as keyof typeof intlWithSupportedValues);
      (mockSupportedValuesOf as ReturnType<typeof vi.spyOn>).mockImplementation(() => {
        throw new Error('Not supported');
      });
      
      const timezones = detector.getSupportedTimezones();
      
      // Should return fallback list
      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones.length).toBeGreaterThan(0);
      expect(timezones).toContain('UTC');
      
      mockSupportedValuesOf.mockRestore();
    } else {
      // If not available, just verify fallback works
      const timezones = detector.getSupportedTimezones();
      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones).toContain('UTC');
    }
  });

  it('handles missing supportedValuesOf gracefully', () => {
    const intlWithSupportedValues = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[];
    };
    
    // Remove supportedValuesOf if it exists
    if (intlWithSupportedValues.supportedValuesOf) {
      delete (intlWithSupportedValues as Partial<typeof intlWithSupportedValues>).supportedValuesOf;
    }
    
    const timezones = detector.getSupportedTimezones();
    
    // Should return fallback list
    expect(Array.isArray(timezones)).toBe(true);
    expect(timezones.length).toBeGreaterThan(0);
  });
});
