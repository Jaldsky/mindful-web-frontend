import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../../../src/services';
import { apiClient } from '../../../src/api/client';
import type { AnalyticsSummaryResponse, AnalyticsUsageResponse } from '../../../src/types';

vi.mock('../../../src/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService();
    vi.clearAllMocks();
  });

  describe('getUsage', () => {
    const mockResponse: AnalyticsUsageResponse = {
      code: 'SUCCESS',
      message: 'Analytics data retrieved successfully',
      from_date: '2024-01-01',
      to_date: '2024-01-31',
      pagination: {
        page: 1,
        per_page: 10,
        total_pages: 1,
        total_items: 1,
        next: null,
        prev: null,
      },
      data: [
        {
          domain: 'example.com',
          total_seconds: 3600,
        },
      ],
    };

    it('should fetch analytics usage successfully', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await service.getUsage({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 1,
      });

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/domains', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
          page: 1,
          per_page: 50,
          sort_by: 'total_seconds',
          order: 'desc',
          search: undefined,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should use default page number if not provided', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      await service.getUsage({
        from: '2024-01-01',
        to: '2024-01-31',
      });

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/domains', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
          page: 1,
          per_page: 50,
          sort_by: 'total_seconds',
          order: 'desc',
          search: undefined,
        },
      });
    });

    it('should pass custom domains params', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      await service.getUsage({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 2,
        per_page: 50,
        sort_by: 'domain',
        order: 'asc',
        search: 'goo',
      });

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/domains', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
          page: 2,
          per_page: 50,
          sort_by: 'domain',
          order: 'asc',
          search: 'goo',
        },
      });
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Network error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(
        service.getUsage({
          from: '2024-01-01',
          to: '2024-01-31',
        })
      ).rejects.toThrow();
    });

    it('should throw ApiError on failure', async () => {
      const mockError = {
        response: {
          data: {
            error: 'Unauthorized',
            message: 'Invalid token',
          },
          status: 401,
        },
      };
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(
        service.getUsage({
          from: '2024-01-01',
          to: '2024-01-31',
        })
      ).rejects.toThrow();
    });
  });

  describe('getSummary', () => {
    const mockResponse: AnalyticsSummaryResponse = {
      code: 'OK',
      message: 'Usage analytics summary computed',
      from_date: '2024-01-01',
      to_date: '2024-01-31',
      data: {
        total_seconds: 7200,
        total_domains: 4,
        avg_seconds_per_domain: 1800,
        top_domain: 'example.com',
        top_domain_seconds: 3600,
      },
    };

    it('should fetch analytics summary successfully', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await service.getSummary({
        from: '2024-01-01',
        to: '2024-01-31',
      });

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/summary', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
