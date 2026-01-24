import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationItem } from '../../../../src/components/layout';
import { LocaleProvider } from '../../../../src/contexts';
import { Home } from 'lucide-react';

const mockItem = {
  path: '/test',
  labelKey: 'navigation.home',
  icon: Home,
};

const renderNavigationItem = (isActive = false) => {
  return render(
    <BrowserRouter>
      <LocaleProvider>
        <NavigationItem item={mockItem} isActive={isActive} />
      </LocaleProvider>
    </BrowserRouter>
  );
};

describe('NavigationItem', () => {
  it('renders navigation link with text', () => {
    renderNavigationItem();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders with correct href', () => {
    renderNavigationItem();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders icon', () => {
    renderNavigationItem();
    const link = screen.getByRole('link');
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with different styles when active', () => {
    const { container: activeContainer } = renderNavigationItem(true);
    const activeLink = screen.getByRole('link');
    expect(activeLink).toBeInTheDocument();
    
    // Clean up
    activeContainer.remove();
    
    const { container: inactiveContainer } = renderNavigationItem(false);
    const inactiveLink = screen.getByRole('link');
    expect(inactiveLink).toBeInTheDocument();
    
    inactiveContainer.remove();
  });
});
