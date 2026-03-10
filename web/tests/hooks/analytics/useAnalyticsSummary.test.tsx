import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAnalyticsSummary } from '../../../src/hooks/analytics/useAnalyticsSummary';
import { analyticsService } from '../../../src/services';

vi.mock('../../../src/services', () => ({
  analyticsService: {
    getSummary: vi.fn(),
  },
}));

describe('useAnalyticsSummary', () => {
  const mockParams = {
    from: '2024-01-01',
    to: '2024-01-07',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('returns summary data when API responds with OK', async () => {
    vi.mocked(analyticsService.getSummary).mockResolvedValue({
      code: 'OK',
      message: 'Usage analytics summary computed',
      from_date: '2024-01-01',
      to_date: '2024-01-07',
      data: {
        total_seconds: 3600,
        total_domains: 2,
        avg_seconds_per_domain: 1800,
        top_domain: 'example.com',
        top_domain_seconds: 2400,
      },
    });

    const { result } = renderHook(() => useAnalyticsSummary(mockParams));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({
      total_seconds: 3600,
      total_domains: 2,
      avg_seconds_per_domain: 1800,
      top_domain: 'example.com',
      top_domain_seconds: 2400,
    });
    expect(analyticsService.getSummary).toHaveBeenCalledTimes(1);
  });

  it('polls when API responds with ACCEPTED and updates after OK', async () => {
    vi.useFakeTimers();

    vi.mocked(analyticsService.getSummary)
      .mockResolvedValueOnce({
        code: 'ACCEPTED',
        message: 'Task accepted',
        task_id: 'task-1',
      })
      .mockResolvedValueOnce({
        code: 'OK',
        message: 'Usage analytics summary computed',
        from_date: '2024-01-01',
        to_date: '2024-01-07',
        data: {
          total_seconds: 7200,
          total_domains: 4,
          avg_seconds_per_domain: 1800,
          top_domain: 'docs.google.com',
          top_domain_seconds: 3000,
        },
      });

    const { result, unmount } = renderHook(() => useAnalyticsSummary(mockParams));

    await act(async () => {
      await Promise.resolve();
    });

    expect(analyticsService.getSummary).toHaveBeenCalledTimes(1);

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
      await Promise.resolve();
    });

    expect(analyticsService.getSummary).toHaveBeenCalledTimes(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data?.total_seconds).toBe(7200);
    expect(result.current.data?.total_domains).toBe(4);

    unmount();
  });

  it('returns error and stops loading on request failure', async () => {
    vi.mocked(analyticsService.getSummary).mockRejectedValue(new Error('Summary failed'));

    const { result } = renderHook(() => useAnalyticsSummary(mockParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Summary failed');
    expect(analyticsService.getSummary).toHaveBeenCalledTimes(1);
  });
});
