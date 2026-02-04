/**
 * Custom hook for fetching analytics data
 * Following React best practices
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsService } from '../../services';
import { extractErrorMessage } from '../../utils';
import type { UseAnalyticsReturn, AnalyticsRequestParams } from '../types';
import type { DomainUsageStat, PaginationMeta } from '../../types';

export function useAnalytics(params: Omit<AnalyticsRequestParams, 'page'>): UseAnalyticsReturn {
  const { from, to } = params;
  const [data, setData] = useState<DomainUsageStat[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPageRef = useRef(1);

  const fetchData = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setData([]);
        currentPageRef.current = 1;
      }
      setError(null);
      
      const response = await analyticsService.getUsage({ from, to, page });
      
      if (append) {
        setData(prev => [...prev, ...response.data]);
      } else {
        setData(response.data);
      }
      setPagination(response.pagination);
      currentPageRef.current = page;
    } catch (err) {
      setError(extractErrorMessage(err));
      if (!append) {
        setData([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [from, to]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pagination || currentPageRef.current >= pagination.total_pages) {
      return;
    }
    await fetchData(currentPageRef.current + 1, true);
  }, [fetchData, loadingMore, pagination]);

  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  const hasMore = pagination ? currentPageRef.current < pagination.total_pages : false;

  return {
    data,
    pagination,
    loading,
    loadingMore,
    hasMore,
    error,
    refetch: () => fetchData(1, false),
    loadMore,
  };
}
