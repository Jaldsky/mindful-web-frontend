import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../../../../src/components/layout';
import { LocaleProvider } from '../../../../src/contexts';

const renderNavigation = () => {
  return render(
    <BrowserRouter>
      <LocaleProvider>
        <Navigation />
      </LocaleProvider>
    </BrowserRouter>
  );
};

describe('Navigation', () => {
  it('renders all navigation items', () => {
    renderNavigation();
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders correct number of navigation links', () => {
    renderNavigation();
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('renders navigation with correct paths', () => {
    renderNavigation();
    
    const homeLink = screen.getByText('Home').closest('a');
    const analyticsLink = screen.getByText('Analytics').closest('a');
    const profileLink = screen.getByText('Profile').closest('a');
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(analyticsLink).toHaveAttribute('href', '/analytics');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('renders icons for each navigation item', () => {
    renderNavigation();
    
    const nav = screen.getByRole('navigation');
    const icons = nav.querySelectorAll('svg');
    expect(icons).toHaveLength(3);
  });
});
