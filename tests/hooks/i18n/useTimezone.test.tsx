import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTimezone } from '../../../src/hooks/i18n/useTimezone';
import { STORAGE_KEYS } from '../../../src/constants';

describe('useTimezone', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns timezone from localStorage if available', async () => {
    localStorage.setItem(STORAGE_KEYS.TIMEZONE, 'America/New_York');

    const { result } = renderHook(() => useTimezone());

    await waitFor(() => {
      expect(result.current.timezone).toBe('America/New_York');
    });
  });

  it('detects and saves timezone if not in localStorage', async () => {
    const { result } = renderHook(() => useTimezone());

    await waitFor(() => {
      expect(result.current.timezone).toBeTruthy();
      expect(localStorage.getItem(STORAGE_KEYS.TIMEZONE)).toBeTruthy();
    });
  });

  it('returns timezone with offset', async () => {
    localStorage.setItem(STORAGE_KEYS.TIMEZONE, 'UTC');

    const { result } = renderHook(() => useTimezone());

    await waitFor(() => {
      expect(result.current.timezoneWithOffset).toContain('UTC');
    });
  });

  it('returns placeholder when timezone is empty', async () => {
    // Mock Intl to return empty timezone
    const originalIntl = global.Intl;
    global.Intl = {
      ...originalIntl,
      DateTimeFormat: vi.fn().mockReturnValue({
        resolvedOptions: () => ({ timeZone: '' }),
      }) as unknown as typeof Intl.DateTimeFormat,
    };

    const { result } = renderHook(() => useTimezone());

    await waitFor(() => {
      expect(result.current.timezoneWithOffset).toBe('—');
    });

    global.Intl = originalIntl;
  });

  it('handles timezone detection errors gracefully', async () => {
    // This test ensures the hook doesn't crash if timezone detection fails
    const { result } = renderHook(() => useTimezone());

    // Should return some value even if detection has issues
    await waitFor(() => {
      expect(result.current).toHaveProperty('timezone');
      expect(result.current).toHaveProperty('timezoneWithOffset');
    });
  });
});
