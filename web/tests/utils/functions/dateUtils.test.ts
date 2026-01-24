import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatTime, getDefaultDateRange, formatDate, getDateRangeForDays } from '../../../src/utils';

describe('dateUtils', () => {
  describe('formatTime', () => {
    it('should format seconds less than 60', () => {
      expect(formatTime(0)).toBe('0s');
      expect(formatTime(30)).toBe('30s');
      expect(formatTime(59)).toBe('59s');
    });

    it('should format minutes less than 60', () => {
      expect(formatTime(60)).toBe('1m');
      expect(formatTime(120)).toBe('2m');
      expect(formatTime(3540)).toBe('59m');
    });

    it('should format hours with minutes', () => {
      expect(formatTime(3600)).toBe('1h');
      expect(formatTime(3660)).toBe('1h 1m');
      expect(formatTime(7200)).toBe('2h');
      expect(formatTime(7320)).toBe('2h 2m');
      expect(formatTime(9000)).toBe('2h 30m');
    });

    it('should handle large values', () => {
      expect(formatTime(86400)).toBe('24h');
      expect(formatTime(90000)).toBe('25h');
    });
  });

  describe('getDefaultDateRange', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return date range for last 7 days by default', () => {
      const fixedDate = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(fixedDate);

      const range = getDefaultDateRange();
      
      expect(range.start).toBe('2024-01-08');
      expect(range.end).toBe('2024-01-15');
    });

    it('should return date range for specified number of days', () => {
      const fixedDate = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(fixedDate);

      const range = getDefaultDateRange(30);
      
      expect(range.start).toBe('2023-12-16');
      expect(range.end).toBe('2024-01-15');
    });

    it('should return dates in YYYY-MM-DD format', () => {
      const fixedDate = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(fixedDate);

      const range = getDefaultDateRange(1);
      
      expect(range.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(range.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD format', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should handle different dates correctly', () => {
      const date1 = new Date('2024-12-31T23:59:59Z');
      expect(formatDate(date1)).toBe('2024-12-31');

      const date2 = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date2)).toBe('2024-01-01');
    });
  });

  describe('getDateRangeForDays', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return date range for specified days', () => {
      const fixedDate = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(fixedDate);

      const range = getDateRangeForDays(14);
      
      expect(range.start).toBe('2024-01-01');
      expect(range.end).toBe('2024-01-15');
    });

    it('should be equivalent to getDefaultDateRange', () => {
      const fixedDate = new Date('2024-01-15T12:00:00Z');
      vi.setSystemTime(fixedDate);

      const range1 = getDateRangeForDays(7);
      const range2 = getDefaultDateRange(7);
      
      expect(range1).toEqual(range2);
    });
  });
});

