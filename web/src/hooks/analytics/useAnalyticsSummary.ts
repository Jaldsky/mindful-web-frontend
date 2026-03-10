import { useEffect, useRef, useState } from 'react';
import { analyticsService } from '../../services';
import { extractErrorMessage } from '../../utils';
import type { AnalyticsSummaryRequestParams, UseAnalyticsSummaryReturn } from '../types';

const SUMMARY_POLL_INTERVAL_MS = 2000;

export function useAnalyticsSummary(params: AnalyticsSummaryRequestParams): UseAnalyticsSummaryReturn {
  const { from, to } = params;
  const [data, setData] = useState<UseAnalyticsSummaryReturn['data']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const fetchSummary = async () => {
      try {
        const response = await analyticsService.getSummary({ from, to });
        if (isCancelled) {
          return;
        }

        if (response.code === 'OK') {
          setData(response.data);
          setLoading(false);
          setError(null);
          clearTimer();
          return;
        }

        // API can temporarily return ACCEPTED while background computation is in progress.
        setData(null);
        setLoading(true);
        setError(null);
        timerRef.current = window.setTimeout(fetchSummary, SUMMARY_POLL_INTERVAL_MS);
      } catch (err) {
        if (isCancelled) {
          return;
        }
        setData(null);
        setLoading(false);
        setError(extractErrorMessage(err));
        clearTimer();
      }
    };

    setData(null);
    setLoading(true);
    setError(null);
    clearTimer();
    fetchSummary();

    return () => {
      isCancelled = true;
      clearTimer();
    };
  }, [from, to]);

  return { data, loading, error };
}
