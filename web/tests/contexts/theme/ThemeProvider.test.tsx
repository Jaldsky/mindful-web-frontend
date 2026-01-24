import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../../src/contexts/theme/ThemeProvider';
import { useTheme } from '../../../src/contexts/hooks';
import { THEME, STORAGE_KEYS } from '../../../src/constants';

const TestComponent = () => {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="isDark">{isDark.toString()}</div>
      <button onClick={() => setTheme(THEME.LIGHT)}>Set Light</button>
      <button onClick={() => setTheme(THEME.DARK)}>Set Dark</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute(THEME.ATTRIBUTE);
  });

  it('initializes with light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
    expect(screen.getByTestId('isDark')).toHaveTextContent('false');
  });

  it('initializes with stored theme from localStorage', async () => {
    localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });
  });

  it('saves theme to localStorage when changed', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe(THEME.DARK);
    });
  });

  it('sets data-theme attribute on document.documentElement for dark theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(document.documentElement.getAttribute(THEME.ATTRIBUTE)).toBe(THEME.DARK);
    });
  });

  it('removes data-theme attribute for light theme', async () => {
    localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute(THEME.ATTRIBUTE)).toBe(THEME.DARK);
    });

    const lightButton = screen.getByText('Set Light');
    lightButton.click();

    await waitFor(() => {
      expect(document.documentElement.getAttribute(THEME.ATTRIBUTE)).toBeNull();
    });
  });

  it('changes theme to dark', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });
  });

  it('changes theme to light', async () => {
    localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const lightButton = screen.getByText('Set Light');
    lightButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');
    });
  });

  it('toggles theme from light to dark', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);

    const toggleButton = screen.getByText('Toggle');
    toggleButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });
  });

  it('toggles theme from dark to light', async () => {
    localStorage.setItem(STORAGE_KEYS.THEME, THEME.DARK);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
    });

    const toggleButton = screen.getByText('Toggle');
    toggleButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');
    });
  });

  it('toggles theme multiple times', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByText('Toggle');

    expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);

    toggleButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
    });

    toggleButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
    });

    toggleButton.click();
    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
    });
  });

  it('ignores invalid stored theme', async () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'invalid-theme');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.LIGHT);
    });
  });

  it('only accepts valid themes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const theme = screen.getByTestId('theme');
    expect(theme).toHaveTextContent(THEME.LIGHT);

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(theme).toHaveTextContent(THEME.DARK);
    });

    const lightButton = screen.getByText('Set Light');
    lightButton.click();

    await waitFor(() => {
      expect(theme).toHaveTextContent(THEME.LIGHT);
    });
  });

  it('persists theme across re-renders', async () => {
    const { rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
    });

    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent(THEME.DARK);
    });
  });

  it('updates isDark when theme changes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('isDark')).toHaveTextContent('false');

    const darkButton = screen.getByText('Set Dark');
    darkButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });

    const lightButton = screen.getByText('Set Light');
    lightButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');
    });
  });
});
