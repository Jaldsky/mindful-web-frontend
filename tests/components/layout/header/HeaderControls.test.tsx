import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeaderControls } from '../../../../src/components/layout/header/HeaderControls';
import { ThemeProvider } from '../../../../src/contexts/ThemeContext';
import { LocaleProvider } from '../../../../src/contexts/LocaleContext';

const renderHeaderControls = () => {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        <HeaderControls />
      </LocaleProvider>
    </ThemeProvider>
  );
};

describe('HeaderControls', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders locale and theme control buttons', () => {
    renderHeaderControls();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('displays current locale', () => {
    renderHeaderControls();
    
    const localeButton = screen.getByText(/EN|RU/i);
    expect(localeButton).toBeInTheDocument();
  });

  it('displays current theme', () => {
    renderHeaderControls();
    
    const themeButton = screen.getByText(/LIGHT|DARK/i);
    expect(themeButton).toBeInTheDocument();
  });

  it('toggles locale when locale button is clicked', async () => {
    renderHeaderControls();
    
    const buttons = screen.getAllByRole('button');
    const localeButton = buttons.find(btn => btn.textContent?.includes('EN') || btn.textContent?.includes('RU'));
    
    expect(localeButton).toBeDefined();
    
    if (localeButton) {
      const initialText = localeButton.textContent;
      fireEvent.click(localeButton);
      
      await waitFor(() => {
        expect(localeButton.textContent).not.toBe(initialText);
      });
    }
  });

  it('toggles theme when theme button is clicked', async () => {
    renderHeaderControls();
    
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons.find(btn => btn.textContent?.includes('LIGHT') || btn.textContent?.includes('DARK'));
    
    expect(themeButton).toBeDefined();
    
    if (themeButton) {
      const initialText = themeButton.textContent;
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        expect(themeButton.textContent).not.toBe(initialText);
      });
    }
  });
});
