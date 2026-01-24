import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LocaleProvider } from '../../../src/contexts/locale/LocaleProvider';
import { useLocale } from '../../../src/contexts/hooks';
import { SUPPORTED_LOCALES } from '../../../src/contexts/constants';
import { STORAGE_KEYS } from '../../../src/constants';

const TestComponent = () => {
  const { locale, setLocale, detectBrowserLocale } = useLocale();

  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <button onClick={() => setLocale(SUPPORTED_LOCALES.EN)}>Set EN</button>
      <button onClick={() => setLocale(SUPPORTED_LOCALES.RU)}>Set RU</button>
      <button onClick={() => setLocale(detectBrowserLocale())}>Detect</button>
    </div>
  );
};

describe('LocaleProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    document.documentElement.removeAttribute('lang');
  });

  it('initializes with default locale when no stored value', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });

  it('initializes with stored locale from localStorage', async () => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'ru');

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });
  });

  it('saves locale to localStorage when changed', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.LOCALE)).toBe('ru');
    });
  });

  it('sets lang attribute on document.documentElement', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('ru');
    });
  });

  it('changes locale to Russian', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });
  });

  it('changes locale to English', async () => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'ru');

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const enButton = screen.getByText('Set EN');
    enButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });

  it('toggles between locales multiple times', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });

    const enButton = screen.getByText('Set EN');
    enButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });

    ruButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });
  });

  it('ignores invalid stored locale', async () => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, 'invalid');

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('en');
    });
  });

  it('provides detectBrowserLocale function', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const detectButton = screen.getByText('Detect');
    expect(detectButton).toBeInTheDocument();
  });

  it('only accepts valid locales', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const locale = screen.getByTestId('locale');
    expect(locale).toHaveTextContent('en');

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(locale).toHaveTextContent('ru');
    });
  });

  it('persists locale across re-renders', async () => {
    const { rerender } = render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    const ruButton = screen.getByText('Set RU');
    ruButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });

    rerender(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('ru');
    });
  });
});
