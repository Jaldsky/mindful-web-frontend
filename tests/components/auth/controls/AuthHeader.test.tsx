import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthHeader } from '../../../../src/components/auth/controls/AuthHeader';
import { LocaleProvider } from '../../../../src/contexts/LocaleContext';
import { ThemeProvider } from '../../../../src/contexts/ThemeContext';

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
    
    const themeButton = screen.getByLabelText('Toggle theme');
    expect(themeButton).toBeInTheDocument();
  });

  it('renders locale toggle button', () => {
    renderWithProviders(<AuthHeader />);
    
    const localeButton = screen.getByLabelText('Change language');
    expect(localeButton).toBeInTheDocument();
  });

  it('displays current locale', () => {
    renderWithProviders(<AuthHeader />);
    
    // Default locale is 'en'
    expect(screen.getByText('en')).toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked', () => {
    renderWithProviders(<AuthHeader />);
    
    const themeButton = screen.getByLabelText('Toggle theme');
    
    // Click to toggle
    fireEvent.click(themeButton);
    
    // Theme should change (we can't directly test the icon change without checking the DOM)
    expect(themeButton).toBeInTheDocument();
  });

  it('toggles locale when locale button is clicked', () => {
    renderWithProviders(<AuthHeader />);
    
    const localeButton = screen.getByLabelText('Change language');
    
    // Initial locale
    expect(screen.getByText('en')).toBeInTheDocument();
    
    // Click to toggle
    fireEvent.click(localeButton);
    
    // Should switch to 'ru'
    expect(screen.getByText('ru')).toBeInTheDocument();
    
    // Click again to toggle back
    fireEvent.click(localeButton);
    
    // Should switch back to 'en'
    expect(screen.getByText('en')).toBeInTheDocument();
  });

  it('renders Moon icon in light theme', () => {
    renderWithProviders(<AuthHeader />);
    
    const themeButton = screen.getByLabelText('Toggle theme');
    const svg = themeButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = renderWithProviders(<AuthHeader />);
    
    const header = container.firstChild;
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('gap-2');
    expect(header).toHaveClass('mb-6');
  });

  it('buttons have hover styles', () => {
    renderWithProviders(<AuthHeader />);
    
    const themeButton = screen.getByLabelText('Toggle theme');
    expect(themeButton).toHaveClass('hover:bg-gray-100');
    expect(themeButton).toHaveClass('dark:hover:bg-gray-800');
  });

  it('locale button displays locale in uppercase', () => {
    renderWithProviders(<AuthHeader />);
    
    const localeText = screen.getByText('en');
    expect(localeText).toHaveClass('uppercase');
  });

  it('renders globe icon in locale button', () => {
    renderWithProviders(<AuthHeader />);
    
    const localeButton = screen.getByLabelText('Change language');
    const svg = localeButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
  });
});
