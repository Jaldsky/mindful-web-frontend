import { Home, BarChart3, User } from 'lucide-react';
import type { NavigationItem } from './types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: '/',
    labelKey: 'navigation.home',
    icon: Home,
  },
  {
    path: '/dashboard',
    labelKey: 'navigation.dashboard',
    icon: BarChart3,
  },
  {
    path: '/profile',
    labelKey: 'navigation.profile',
    icon: User,
  },
];

export const HEADER_STYLES = {
  container: {
    backgroundColor: 'var(--color-bg-primary)',
    borderColor: 'var(--border-color)',
    boxShadow: 'var(--shadow-xs)',
  },
  logo: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  button: {
    base: {
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--border-color)',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: 'var(--shadow-sm)',
      color: 'var(--color-text-primary)',
      transition: 'all var(--transition-normal)',
    },
    hover: {
      backgroundColor: 'var(--color-bg-tertiary)',
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-md)',
    },
  },
  primaryButton: {
    base: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      borderColor: 'var(--color-primary)',
      borderRadius: 'var(--border-radius-md)',
      textDecoration: 'none',
    },
    hover: {
      backgroundColor: 'var(--color-primary-hover)',
    },
  },
  navLink: {
    active: {
      backgroundColor: 'var(--color-bg-secondary)',
      color: 'var(--color-primary)',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all var(--transition-normal)',
    },
    inactive: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-primary)',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all var(--transition-normal)',
    },
  },
} as const;

export const LAYOUT_STYLES = {
  container: {
    backgroundColor: 'var(--color-bg-overlay)',
    fontFamily: 'var(--font-family)',
  },
  main: {
    minHeight: 'calc(100vh - 4rem)',
  },
} as const;
