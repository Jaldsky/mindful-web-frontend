/**
 * Theme Context
 * Manages theme state (light/dark mode)
 * Following React Context pattern
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { THEME, STORAGE_KEYS } from '../constants';

interface ThemeContextType {
  theme: string;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored && (stored === THEME.LIGHT || stored === THEME.DARK)) {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME.DARK;
    }
    
    return THEME.LIGHT;
  });

  useEffect(() => {
    // Apply theme to document - matching plugin style
    if (theme === THEME.DARK) {
      document.documentElement.setAttribute(THEME.ATTRIBUTE, THEME.DARK);
    } else {
      document.documentElement.removeAttribute(THEME.ATTRIBUTE);
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: string) => {
    if (newTheme === THEME.LIGHT || newTheme === THEME.DARK) {
      setThemeState(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  }, []);

  const value: ThemeContextType = {
    theme,
    isDark: theme === THEME.DARK,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

