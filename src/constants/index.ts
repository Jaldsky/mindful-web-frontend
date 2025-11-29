/**
 * Centralized configuration and constants
 * Following the pattern from the extension plugin
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
} as const;

export const STORAGE_KEYS = {
  USER_ID: 'x-user-id',
  THEME: 'mindful_theme',
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
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'mindful_theme',
  ATTRIBUTE: 'data-theme',
} as const;

