import type { UserProfile } from '../types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'welcome';

export interface AuthContextType {
  status: AuthStatus;
  user: UserProfile | null;
  anonId: string | null;
  showWelcome: boolean;
  dismissWelcome: () => void;
  showWelcomeScreen: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  createAnonymous: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
}

export interface ThemeContextType {
  theme: string;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

import type { Locale } from './constants';

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  detectBrowserLocale: () => Locale;
}

export interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  generateUserId: () => string;
}
