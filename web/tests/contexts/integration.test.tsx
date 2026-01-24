/**
 * Integration Tests for Contexts
 * Testing full context integration with components
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider, useLocale, SUPPORTED_LOCALES, ThemeProvider, useTheme } from '../../src/contexts';
import { THEME } from '../../src/constants';

describe('Context Integration Tests', () => {
  describe('LocaleContext Integration', () => {
    const LocaleTestComponent = () => {
      const { locale, setLocale } = useLocale();
      
      return (
        <div>
          <div data-testid="locale">{locale}</div>
          <button onClick={() => setLocale(SUPPORTED_LOCALES.EN)}>Set EN</button>
          <button onClick={() => setLocale(SUPPORTED_LOCALES.RU)}>Set RU</button>
        </div>
      );
    };

    beforeEach(() => {
      localStorage.clear();
    });

    it('provides default English locale', () => {
      render(
        <LocaleProvider>
          <LocaleTestComponent />
        </LocaleProvider>
      );
      
      expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.EN);
    });

    it('changes locale to Russian', async () => {
      render(
        <LocaleProvider>
          <LocaleTestComponent />
        </LocaleProvider>
      );
      
      fireEvent.click(screen.getByText('Set RU'));
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.RU);
      });
    });

    it('changes locale to English', async () => {
      render(
        <LocaleProvider>
          <LocaleTestComponent />
        </LocaleProvider>
      );
      
      fireEvent.click(screen.getByText('Set RU'));
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.RU);
      });
      
      fireEvent.click(screen.getByText('Set EN'));
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.EN);
      });
    });

    it('toggles between locales', async () => {
      render(
        <LocaleProvider>
          <LocaleTestComponent />
        </LocaleProvider>
      );
      
      // Start with EN
      expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.EN);
      
      // Change to RU
      fireEvent.click(screen.getByText('Set RU'));
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.RU);
      });
      
      // Back to EN
      fireEvent.click(screen.getByText('Set EN'));
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent(SUPPORTED_LOCALES.EN);
      });
    });
  });

  describe('ThemeContext Integration', () => {
    const ThemeTestComponent = () => {
      const { theme, isDark, toggleTheme, setTheme } = useTheme();
      
      return (
        <div>
          <div data-testid="theme">{theme}</div>
          <div data-testid="isDark">{isDark ? 'dark' : 'light'}</div>
          <button onClick={toggleTheme}>Toggle</button>
          <button onClick={() => setTheme(THEME.LIGHT)}>Set Light</button>
          <button onClick={() => setTheme(THEME.DARK)}>Set Dark</button>
        </div>
      );
    };

    beforeEach(() => {
      localStorage.clear();
    });

    it('provides default light theme', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
      expect(screen.getByTestId('isDark')).toHaveTextContent('light');
    });

    it('toggles theme', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );
      
      const toggleButton = screen.getByText('Toggle');
      
      // Toggle to dark
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
        expect(screen.getByTestId('isDark')).toHaveTextContent('dark');
      });
      
      // Toggle back to light
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
        expect(screen.getByTestId('isDark')).toHaveTextContent('light');
      });
    });

    it('sets theme to light', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );
      
      fireEvent.click(screen.getByText('Set Dark'));
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
      });
      
      fireEvent.click(screen.getByText('Set Light'));
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
      });
    });

    it('updates theme state when changed', async () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
      
      fireEvent.click(screen.getByText('Set Dark'));
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
      });
    });
  });
});
