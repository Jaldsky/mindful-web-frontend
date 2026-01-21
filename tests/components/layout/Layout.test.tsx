import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../../../src/components/layout/Layout';
import { ThemeProvider } from '../../../src/contexts/ThemeContext';
import { LocaleProvider } from '../../../src/contexts/LocaleContext';
import { AuthProvider } from '../../../src/contexts/AuthContext';

const renderLayout = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Layout', () => {
  it('renders children content', () => {
    renderLayout(<div>Test Content</div>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders app logo/title', () => {
    renderLayout(<div>Content</div>);
    expect(screen.getByText(/Mindful Web/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderLayout(<div>Content</div>);
    
    // Check for navigation items
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('renders theme toggle button', () => {
    renderLayout(<div>Content</div>);
    
    const themeButton = screen.getByTitle('Toggle theme');
    expect(themeButton).toBeInTheDocument();
  });

  it('renders language toggle button', () => {
    renderLayout(<div>Content</div>);
    
    // Look for language-related elements
    const buttons = screen.getAllByRole('button');
    const langButton = buttons.find(btn => btn.textContent?.includes('EN') || btn.textContent?.includes('RU'));
    expect(langButton).toBeDefined();
  });

  it('renders header component', () => {
    renderLayout(<div>Content</div>);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders main content area', () => {
    renderLayout(<div data-testid="main-content">Main Content</div>);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    const { container } = renderLayout(<div>Content</div>);
    
    // Check for min-h-screen class
    const layoutRoot = container.firstChild;
    expect(layoutRoot).toHaveClass('min-h-screen');
  });

  it('wraps children in main element', () => {
    renderLayout(<div data-testid="test-child">Test</div>);
    
    const main = screen.getByRole('main');
    const child = screen.getByTestId('test-child');
    
    expect(main).toContainElement(child);
  });
});
