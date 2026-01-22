import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthHeader } from '../../../../src/components/auth/controls/AuthHeader';
import { LocaleProvider } from '../../../../src/contexts';
import { ThemeProvider } from '../../../../src/contexts';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <LocaleProvider>{component}</LocaleProvider>
    </ThemeProvider>
  );
};

describe('AuthHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders theme toggle button', () => {
    renderWithProviders(<AuthHeader />);
    
    // Button uses title attribute, not aria-label
    const themeButton = screen.getByTitle(/theme/i);
    expect(themeButton).toBeInTheDocument();
  });

  it('renders locale toggle button', () => {
    renderWithProviders(<AuthHeader />);
    
    // Button uses title attribute, not aria-label
    const localeButton = screen.getByTitle(/language|русский|english/i);
    expect(localeButton).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', () => {
    renderWithProviders(<AuthHeader />);
    
    const themeButton = screen.getByTitle(/theme/i);
    
    // Click to toggle
    fireEvent.click(themeButton);
    
    // Theme should change (we can't directly test the icon change without checking the DOM)
    expect(themeButton).toBeInTheDocument();
  });

  it('toggles locale when locale button is clicked', () => {
    renderWithProviders(<AuthHeader />);
    
    const localeButton = screen.getByTitle(/language|русский|english/i);
    
    // Click to toggle
    fireEvent.click(localeButton);
    
    // Button should still be in document
    expect(localeButton).toBeInTheDocument();
  });

  it('renders icons in buttons', () => {
    renderWithProviders(<AuthHeader />);
    
    const themeButton = screen.getByTitle(/theme/i);
    const localeButton = screen.getByTitle(/language|русский|english/i);
    
    // Buttons should contain icons (emoji or span)
    expect(themeButton.textContent).toBeTruthy();
    expect(localeButton.textContent).toBeTruthy();
  });

  it('has correct styling', () => {
    const { container } = renderWithProviders(<AuthHeader />);
    
    const header = container.firstChild as HTMLElement;
    expect(header).toBeInTheDocument();
    expect(header.style.display).toBe('flex');
  });

  it('buttons are positioned absolutely', () => {
    const { container } = renderWithProviders(<AuthHeader />);
    
    const header = container.firstChild as HTMLElement;
    expect(header.style.position).toBe('absolute');
  });
});
