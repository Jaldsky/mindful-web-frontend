/**
 * Custom hook for managing date range state
 */

import { useState, useCallback } from 'react';
import { getDefaultDateRange, getDateRangeForDays } from '../utils/dateUtils';
import { DATE_RANGES } from '../constants';

export interface DateRange {
  start: string;
  end: string;
}

export interface UseDateRangeReturn {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  selectQuickRange: (days: number) => void;
  resetToDefault: () => void;
}

export function useDateRange(defaultDays: number = DATE_RANGES.DAYS_7): UseDateRangeReturn {
  const [dateRange, setDateRangeState] = useState<DateRange>(getDefaultDateRange(defaultDays));

  const setDateRange = useCallback((range: DateRange) => {
    setDateRangeState(range);
  }, []);

  const setStartDate = useCallback((date: string) => {
    setDateRangeState(prev => ({ ...prev, start: date }));
  }, []);

  const setEndDate = useCallback((date: string) => {
    setDateRangeState(prev => ({ ...prev, end: date }));
  }, []);

  const selectQuickRange = useCallback((days: number) => {
    setDateRangeState(getDateRangeForDays(days));
  }, []);

  const resetToDefault = useCallback(() => {
    setDateRangeState(getDefaultDateRange(defaultDays));
  }, [defaultDays]);

  return {
    dateRange,
    setDateRange,
    setStartDate,
    setEndDate,
    selectQuickRange,
    resetToDefault,
  };
}

