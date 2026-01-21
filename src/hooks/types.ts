/**
 * Hook Types
 * All hook-related types in one place
 */

import type { AnalyticsUsageResponse } from '../types';
import type { AnalyticsRequestParams } from '../services/AnalyticsService';
import type { AuthScreen } from '../components/auth';

export type { AnalyticsUsageResponse };

export type { AnalyticsRequestParams };

export interface UseAnalyticsReturn {
  data: AnalyticsUsageResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAuthAnimationReturn {
  activeScreen: AuthScreen;
  displayScreen: AuthScreen;
  isTransitioning: boolean;
  isMeasuring: boolean;
  containerHeight: string;
  containerWidth: string;
  containerRef: React.RefObject<HTMLDivElement>;
  switchScreen: (newScreen: AuthScreen) => void;
}

export interface ChartDimensions {
  height: number;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

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

export interface UseTimezoneReturn {
  timezone: string;
  timezoneWithOffset: string;
}

export interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
}
