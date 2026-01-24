import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '../../../src/hooks';
import { analyticsService } from '../../../src/services';

vi.mock('../../../src/services', () => ({
  analyticsService: {
    getUsage: vi.fn(),
  },
}));

describe('useAnalytics', () => {
  const mockParams = {
    from: '2024-01-01',
    to: '2024-01-07',
    page: 1,
  };

  const mockResponse = {
    code: 'SUCCESS',
    message: 'Data retrieved',
    from_date: '2024-01-01',
    to_date: '2024-01-07',
    pagination: {
      page: 1,
      per_page: 10,
      total_items: 2,
      total_pages: 1,
      next: null,
      prev: null,
    },
    data: [
      { domain: 'example.com', category: 'productivity', total_seconds: 3600 },
      { domain: 'test.com', category: 'social', total_seconds: 1800 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data on mount', async () => {
    vi.mocked(analyticsService.getUsage).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAnalytics(mockParams));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
    expect(analyticsService.getUsage).toHaveBeenCalledWith(mockParams);
  });

  it('handles errors correctly', async () => {
    const errorMessage = 'Failed to fetch data';
    vi.mocked(analyticsService.getUsage).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAnalytics(mockParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.data).toBeNull();
  });

  it('refetches data when called', async () => {
    vi.mocked(analyticsService.getUsage).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAnalytics(mockParams));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(analyticsService.getUsage).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    await waitFor(() => {
      expect(analyticsService.getUsage).toHaveBeenCalledTimes(2);
    });
  });

  it('updates when params change', async () => {
    vi.mocked(analyticsService.getUsage).mockResolvedValue(mockResponse);

    const { result, rerender } = renderHook(
      ({ params }) => useAnalytics(params),
      {
        initialProps: { params: mockParams },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(analyticsService.getUsage).toHaveBeenCalledWith(mockParams);

    const newParams = { ...mockParams, page: 2 };
    rerender({ params: newParams });

    await waitFor(() => {
      expect(analyticsService.getUsage).toHaveBeenCalledWith(newParams);
    });
  });

  it('sets loading state correctly during fetch', async () => {
    vi.mocked(analyticsService.getUsage).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    const { result } = renderHook(() => useAnalytics(mockParams));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('provides refetch function', () => {
    vi.mocked(analyticsService.getUsage).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAnalytics(mockParams));

    expect(typeof result.current.refetch).toBe('function');
  });

  it('clears error on successful refetch', async () => {
    vi.mocked(analyticsService.getUsage)
      .mockRejectedValueOnce(new Error('Error'))
      .mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAnalytics(mockParams));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
