/**
 * Centralized configuration and constants
 * Following the pattern from the extension plugin
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
} as const;

export const STORAGE_KEYS = {
  USER_ID: 'x-user-id',
  THEME: 'mindful_theme',
  LOCALE: 'mindful_locale',
  USER_EMAIL: 'user-email',
  USERNAME: 'username',
  USER_CREATED_AT: 'user-created-at',
  TIMEZONE: 'user-timezone',
  NOTIFICATIONS_ENABLED: 'notifications-enabled',
  EMAIL_NOTIFICATIONS: 'email-notifications',
} as const;

export const DATE_RANGES = {
  DAYS_7: 7,
  DAYS_30: 30,
  DAYS_90: 90,
} as const;

export const CHART_CONFIG = {
  MIN_HEIGHT: 350,
  BAR_SIZE: 32,
  BAR_HEIGHT_MULTIPLIER: 45,
  MARGIN: {
    LEFT: 20,
    RIGHT: 20,
    TOP: 0,
    BOTTOM: 10,
  },
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#8B5CF6',
    TERTIARY: '#10B981',
    QUATERNARY: '#F59E0B',
    QUINARY: '#EC4899',
    SENARY: '#06B6D4',
  },
} as const;

export const TABLE_CONFIG = {
  CELL_CLASSES: {
    DOMAIN: 'py-3 px-4 font-medium text-gray-900 dark:text-white',
    CATEGORY: 'py-3 px-4 text-gray-500 dark:text-gray-400',
    DURATION: 'py-3 px-4 text-right tabular-nums text-gray-600 dark:text-gray-300',
  },
  EMPTY_CELL_PLACEHOLDER: '—',
} as const;

export const QUICK_RANGES = [
  { days: DATE_RANGES.DAYS_7, label: '7D' },
  { days: DATE_RANGES.DAYS_30, label: '30D' },
  { days: DATE_RANGES.DAYS_90, label: '90D' },
] as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'mindful_theme',
  ATTRIBUTE: 'data-theme',
} as const;

