import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../../../../src/components/layout';
import { ThemeProvider } from '../../../../src/contexts';
import { LocaleProvider } from '../../../../src/contexts';
import { AuthProvider } from '../../../../src/contexts';

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <Header />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders the logo', () => {
    renderHeader();
    const logos = screen.getAllByText(/Mindful Web/i);
    expect(logos.length).toBeGreaterThan(0);
  });

  it('renders navigation items', () => {
    renderHeader();
    
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
    const analyticsLinks = screen.getAllByText('Analytics');
    expect(analyticsLinks.length).toBeGreaterThan(0);
    const profileLinks = screen.getAllByText('Profile');
    expect(profileLinks.length).toBeGreaterThan(0);
  });

  it('renders auth button', () => {
    renderHeader();
    const signInButtons = screen.getAllByText('Sign In');
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  it('renders header controls', () => {
    renderHeader();
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has sticky positioning', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky');
  });

  it('contains all main sections', () => {
    renderHeader();
    
    // Logo section
    const logos = screen.getAllByText(/Mindful Web/i);
    expect(logos.length).toBeGreaterThan(0);
    
    // Navigation section
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThan(0);
    
    // Controls section - EN/RU button exists
    const localeButtons = screen.getAllByText(/EN|RU/i);
    expect(localeButtons.length).toBeGreaterThan(0);
    
    // Theme button exists (by icon or title)
    const buttons = screen.getAllByRole('button');
    const themeButton = buttons.find(btn => 
      btn.getAttribute('title')?.includes('Theme') || 
      btn.getAttribute('title')?.includes('тема') ||
      btn.textContent?.includes('☀️') ||
      btn.textContent?.includes('🌙')
    );
    expect(themeButton).toBeDefined();
  });
});
