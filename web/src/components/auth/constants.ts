/**
 * Auth-specific constants
 */

export const AUTH_VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  CODE_LENGTH: 6,
  USERNAME_PATTERN: /^[a-zA-Z0-9_]+$/,
} as const;

export const AUTH_STYLES = {
  INPUT_BASE: 'app-input w-full border',
  BUTTON_BASE: 'app-button w-full',
  ERROR_TEXT: 'text-red-500 text-sm mt-1',
  LINK_TEXT: 'text-sm hover:underline cursor-pointer',
} as const;
