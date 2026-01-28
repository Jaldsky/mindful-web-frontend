/**
 * Home Component Constants
 */

export const FEATURE_COLORS = {
  blue: { bg: '#E0F7FA', text: '#0D9488' },
  green: { bg: '#E0F2FE', text: '#0284C7' },
  purple: { bg: '#EEF2FF', text: '#4F46E5' },
} as const;

export const SECTION_COLORS = {
  features: '#0D9488',
  extension: '#0284C7',
} as const;

export const EXTENSION_URLS = {
  chrome: 'https://github.com/Jaldsky/mindful-web-extensions/releases',
  firefox: '',
  edge: '',
} as const;

export const GRADIENT_COLORS = {
  welcome: 'linear-gradient(90deg, #4CAF50, #81C784, #4CAF50, #2E7D32, #4CAF50)',
} as const;
