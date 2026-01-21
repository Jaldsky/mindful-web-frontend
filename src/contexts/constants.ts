export const SUPPORTED_LOCALES = {
  EN: 'en',
  RU: 'ru',
} as const;

export type Locale = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES];

export const DEFAULT_LOCALE: Locale = SUPPORTED_LOCALES.EN;
