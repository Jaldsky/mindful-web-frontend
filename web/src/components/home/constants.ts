/**
 * Home Component Constants
 */

export const FEATURE_COLORS = {
  blue: { bg: '#E3F2FD', text: '#2196F3' },
  green: { bg: '#E8F5E9', text: '#4CAF50' },
  purple: { bg: '#F3E5F5', text: '#9C27B0' },
} as const;

export const SECTION_COLORS = {
  features: '#9C27B0',
  extension: '#4CAF50',
} as const;

export const EXTENSION_URLS = {
  chrome: 'https://github.com/Jaldsky/mindful-web-extensions/releases',
  firefox: '',
  edge: '',
} as const;

export const GRADIENT_COLORS = {
  welcome: 'linear-gradient(90deg, #4CAF50, #81C784, #4CAF50, #2E7D32, #4CAF50)',
} as const;
