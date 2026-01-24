import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeaderControls } from '../../../../src/components/layout';
import { ThemeProvider } from '../../../../src/contexts';
import { LocaleProvider } from '../../../../src/contexts';

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
    // There are 3 buttons: theme icon, locale icon, and locale text button
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('displays current locale', () => {
    renderHeaderControls();
    
    const localeButton = screen.getByText(/EN|RU/i);
    expect(localeButton).toBeInTheDocument();
  });

  it('displays current theme', () => {
    renderHeaderControls();
    
    // Theme button uses icon, find by title or icon content
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons.find(btn => 
      btn.getAttribute('title')?.includes('Theme') || 
      btn.getAttribute('title')?.includes('тема') ||
      btn.textContent?.includes('☀️') ||
      btn.textContent?.includes('🌙')
    );
    expect(themeButton).toBeDefined();
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
    const themeButton = buttons.find(btn => 
      btn.getAttribute('title')?.includes('Theme') || 
      btn.getAttribute('title')?.includes('тема') ||
      btn.textContent?.includes('☀️') ||
      btn.textContent?.includes('🌙')
    );
    
    expect(themeButton).toBeDefined();
    
    if (themeButton) {
      const initialTitle = themeButton.getAttribute('title');
      fireEvent.click(themeButton);
      
      await waitFor(() => {
        const newTitle = themeButton.getAttribute('title');
        expect(newTitle).not.toBe(initialTitle);
      }, { timeout: 1000 });
    }
  });
});
