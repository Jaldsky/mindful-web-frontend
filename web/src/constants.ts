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
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  ANON_ID: 'anon-id',
  ANON_TOKEN: 'anon-token',
  WELCOME_SHOWN: 'welcome-shown',
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
  BAR_SIZE: 40,
  BAR_HEIGHT_MULTIPLIER: 45,
  MARGIN: {
    LEFT: 20,
    RIGHT: 20,
    TOP: 0,
    BOTTOM: 10,
  },
  COLORS: {
    PRIMARY: '#4CAF50',
    SECONDARY: '#2196F3',
    TERTIARY: '#FF9800',
    QUATERNARY: '#9C27B0',
  },
  SCROLLABLE_THRESHOLD: 8,
} as const;

export const TABLE_CONFIG = {
  EMPTY_CELL_PLACEHOLDER: '-',
  CELL_CLASSES: {
    DOMAIN: 'py-3 font-medium',
    CATEGORY: 'py-3 text-gray-500',
    DURATION: 'py-3 text-right font-mono',
  },
} as const;

export const QUICK_RANGES = [
  { label: '7 days', days: DATE_RANGES.DAYS_7 },
  { label: '30 days', days: DATE_RANGES.DAYS_30 },
  { label: '90 days', days: DATE_RANGES.DAYS_90 },
] as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'mindful_theme',
  ATTRIBUTE: 'data-theme',
} as const;

