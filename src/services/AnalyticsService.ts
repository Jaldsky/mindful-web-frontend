/**
 * Analytics Service
 * Handles all analytics-related API calls
 * Following the Manager pattern from the extension plugin
 */

import { apiClient } from '../api/client';
import { AnalyticsUsageResponse } from '../types/api';
import { createApiError } from '../utils/errorUtils';

export interface AnalyticsRequestParams {
  from: string;
  to: string;
  page?: number;
}

export class AnalyticsService {
  /**
   * Fetches usage analytics for a given date range
   * @param params - Request parameters (from, to, page)
   * @returns Promise with analytics data
   * @throws ApiError if request fails
   */
  async getUsage(params: AnalyticsRequestParams): Promise<AnalyticsUsageResponse> {
    try {
      const response = await apiClient.get<AnalyticsUsageResponse>('/analytics/usage', {
        params: {
          from: params.from,
          to: params.to,
          page: params.page || 1,
        },
      });
      
      return response.data;
    } catch (error) {
      const apiError = createApiError(error);
      throw apiError;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

