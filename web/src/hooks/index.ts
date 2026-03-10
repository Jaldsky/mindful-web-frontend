/**
 * Custom Hooks
 * Centralized export for all custom hooks
 */

export { useAnalytics, useAnalyticsSummary, useChartDimensions, useDateRange } from './analytics';
export { useAuthAnimation } from './auth';
export { useHomeEntranceAnimation } from './home';
export { useTranslation, useTimezone } from './i18n';
export {
  useProfileData,
  useProfileEditing,
  useProfileTimezone,
  useProfileCopy,
  useProfileLogout,
  useProfileEntranceAnimation,
  useProfileErrorState,
} from './profile';
export type {
  UseAnalyticsReturn,
  UseAnalyticsSummaryReturn,
  AnalyticsRequestParams,
  AnalyticsSummaryRequestParams,
  AnalyticsUsageResponse,
  AnalyticsSummaryResponse,
  UseAuthAnimationReturn,
  ChartDimensions,
  DateRange,
  UseDateRangeReturn,
  UseTimezoneReturn,
  UseTranslationReturn,
} from './types';
export { timezoneDetector, translationService } from './utils';
export type { TimezoneDetector, TranslationService } from './utils';
