import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../../../src/services/analytics/AnalyticsService';
import { apiClient } from '../../../src/api/client';
import { ApiError } from '../../../src/utils/errorUtils';
import type { AnalyticsUsageResponse } from '../../../src/types';

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
      domains: [
        {
          domain: 'example.com',
          total_time: 3600,
          visit_count: 10,
        },
      ],
      total_domains: 1,
      total_time: 3600,
      page: 1,
      page_size: 10,
      total_pages: 1,
    };

    it('should fetch analytics usage successfully', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

      const result = await service.getUsage({
        from: '2024-01-01',
        to: '2024-01-31',
        page: 1,
      });

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/usage', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
          page: 1,
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

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/usage', {
        params: {
          from: '2024-01-01',
          to: '2024-01-31',
          page: 1,
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
      ).rejects.toThrow(ApiError);
    });
  });
});
