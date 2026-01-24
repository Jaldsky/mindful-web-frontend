/**
 * Timezone Detector
 * Handles timezone detection and formatting
 * Follows Single Responsibility Principle
 */

export interface ITimezoneDetector {
  detectTimezone(): string;
  getTimezoneOffset(timezone?: string): string;
  formatTimezoneWithOffset(timezone: string): string;
  getSupportedTimezones(): string[];
}

export class TimezoneDetector implements ITimezoneDetector {
  /**
   * Detect browser timezone
   */
  detectTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn('Failed to detect timezone:', error);
      return 'UTC';
    }
  }

  /**
   * Get timezone offset string (e.g., "GMT-5")
   */
  getTimezoneOffset(timezone?: string): string {
    try {
      const date = new Date();
      const tzString = date.toLocaleString('en-US', {
        timeZone: timezone || this.detectTimezone(),
        timeZoneName: 'short',
      });
      
      const parts = tzString.split(' ');
      const offset = parts[parts.length - 1];
      
      return offset || '';
    } catch (error) {
      console.warn('Failed to get timezone offset:', error);
      return '';
    }
  }

  /**
   * Format timezone with offset (e.g., "America/New_York (GMT-5)")
   */
  formatTimezoneWithOffset(timezone: string): string {
    if (!timezone) {
      return '—';
    }

    const offset = this.getTimezoneOffset(timezone);
    return offset ? `${timezone} (${offset})` : timezone;
  }

  getSupportedTimezones(): string[] {
    try {
      const intlWithSupportedValues = Intl as typeof Intl & {
        supportedValuesOf?: (key: 'timeZone') => string[];
      };
      if (typeof intlWithSupportedValues.supportedValuesOf === 'function') {
        return intlWithSupportedValues.supportedValuesOf('timeZone').sort();
      }
    } catch {
      // Fallback to common timezones below
    }

    return [
      'UTC',
      'Europe/Moscow',
      'Europe/Kiev',
      'Europe/Minsk',
      'Europe/Warsaw',
      'Europe/Berlin',
      'Europe/Paris',
      'Europe/London',
      'Europe/Rome',
      'Europe/Madrid',
      'Europe/Athens',
      'Europe/Istanbul',
      'Asia/Dubai',
      'Asia/Tashkent',
      'Asia/Almaty',
      'Asia/Baku',
      'Asia/Yerevan',
      'Asia/Tbilisi',
      'Asia/Tehran',
      'Asia/Karachi',
      'Asia/Kolkata',
      'Asia/Dhaka',
      'Asia/Bangkok',
      'Asia/Shanghai',
      'Asia/Tokyo',
      'Asia/Seoul',
      'Asia/Hong_Kong',
      'Asia/Singapore',
      'Australia/Sydney',
      'Australia/Melbourne',
      'Australia/Perth',
      'Pacific/Auckland',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Toronto',
      'America/Mexico_City',
      'America/Sao_Paulo',
      'America/Buenos_Aires',
      'Africa/Cairo',
      'Africa/Johannesburg',
    ].sort();
  }
}

export const timezoneDetector = new TimezoneDetector();
