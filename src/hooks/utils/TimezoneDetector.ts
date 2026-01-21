/**
 * Timezone Detector
 * Handles timezone detection and formatting
 * Follows Single Responsibility Principle
 */

export class TimezoneDetector {
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
}

export const timezoneDetector = new TimezoneDetector();
