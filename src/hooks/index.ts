/**
 * Custom Hooks
 * Centralized export for all custom hooks
 */

export { useAnalytics, useChartDimensions, useDateRange } from './analytics';
export { useAuthAnimation } from './auth';
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
  AnalyticsRequestParams,
  AnalyticsUsageResponse,
  UseAuthAnimationReturn,
  ChartDimensions,
  DateRange,
  UseDateRangeReturn,
  UseTimezoneReturn,
  UseTranslationReturn,
} from './types';
export { timezoneDetector, translationService } from './utils';
export type { TimezoneDetector, TranslationService } from './utils';
