/**
 * Analytics Service
 * Handles all analytics-related API calls
 * Following the Manager pattern from the extension plugin
 */

import { apiClient } from '../../api/client';
import type { AnalyticsUsageResponse } from '../../types';
import { createApiError } from '../../utils';
import type { IAnalyticsService } from '../interfaces';
import type { AnalyticsRequestParams } from '../types';

export class AnalyticsService implements IAnalyticsService {
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
      throw createApiError(error);
    }
  }
}

export const analyticsService = new AnalyticsService();
