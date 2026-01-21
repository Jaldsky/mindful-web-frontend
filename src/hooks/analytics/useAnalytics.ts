/**
 * Custom hook for fetching analytics data
 * Following React best practices
 */

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../../services/AnalyticsService';
import { ApiError } from '../../utils/errorUtils';
import type { UseAnalyticsReturn, AnalyticsRequestParams, AnalyticsUsageResponse } from '../types';

export function useAnalytics(params: AnalyticsRequestParams): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsService.getUsage(params);
      setData(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

