/**
 * Analytics Service
 * Handles all analytics-related API calls
 * Following the Manager pattern from the extension plugin
 */

import { apiClient } from '../../api/client';
import type { AnalyticsSummaryResponse, AnalyticsUsageResponse } from '../../types';
import { createApiError } from '../../utils';
import type { IAnalyticsService } from '../interfaces';
import type { AnalyticsRequestParams, AnalyticsSummaryRequestParams } from '../types';

export class AnalyticsService implements IAnalyticsService {
  async getUsage(params: AnalyticsRequestParams): Promise<AnalyticsUsageResponse> {
    try {
      const response = await apiClient.get<AnalyticsUsageResponse>('/analytics/domains', {
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

  async getSummary(params: AnalyticsSummaryRequestParams): Promise<AnalyticsSummaryResponse> {
    try {
      const response = await apiClient.get<AnalyticsSummaryResponse>('/analytics/summary', {
        params: {
          from: params.from,
          to: params.to,
        },
      });

      return response.data;
    } catch (error) {
      throw createApiError(error);
    }
  }
}

export const analyticsService = new AnalyticsService();
