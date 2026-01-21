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
    expect(screen.getByText(/Mindful Web/i)).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    renderHeader();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders auth button', () => {
    renderHeader();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
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
    expect(screen.getByText(/Mindful Web/i)).toBeInTheDocument();
    
    // Navigation section
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Controls section
    expect(screen.getByText(/EN|RU/i)).toBeInTheDocument();
    expect(screen.getByText(/LIGHT|DARK/i)).toBeInTheDocument();
  });
});
