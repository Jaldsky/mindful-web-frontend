import React, { useEffect, useState, useCallback } from 'react';
import { ThemeContext } from '../contexts';
import { storageManager } from '../utils';
import { THEME, STORAGE_KEYS } from '../../constants';
import type { ThemeContextType } from '../types';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    const stored = storageManager.getItem(STORAGE_KEYS.THEME);
    if (stored && (stored === THEME.LIGHT || stored === THEME.DARK)) {
      return stored;
    }
    return THEME.LIGHT;
  });

  useEffect(() => {
    if (theme === THEME.DARK) {
      document.documentElement.setAttribute(THEME.ATTRIBUTE, THEME.DARK);
    } else {
      document.documentElement.removeAttribute(THEME.ATTRIBUTE);
    }
    storageManager.setItem(STORAGE_KEYS.THEME, theme);
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
