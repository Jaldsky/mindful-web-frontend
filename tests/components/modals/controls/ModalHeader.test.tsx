import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalHeader } from '../../../../src/components/modals/controls/ModalHeader';

describe('ModalHeader', () => {
  it('renders title and subtitle', () => {
    render(
      <ModalHeader
        title="Welcome"
        subtitle="Get started with Mindful Web"
        onToggleTheme={vi.fn()}
        onToggleLocale={vi.fn()}
        themeIcon="☀️"
        themeTitle="Toggle theme"
        localeIcon="🇺🇸"
        localeTitle="Switch language"
      />
    );
    
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Get started with Mindful Web')).toBeInTheDocument();
  });

  it('renders theme and locale toggle buttons', () => {
    render(
      <ModalHeader
        title="Welcome"
        subtitle="Subtitle"
        onToggleTheme={vi.fn()}
        onToggleLocale={vi.fn()}
        themeIcon="☀️"
        themeTitle="Toggle theme"
        localeIcon="🇺🇸"
        localeTitle="Switch language"
      />
    );
    
    expect(screen.getByTitle('Toggle theme')).toBeInTheDocument();
    expect(screen.getByTitle('Switch language')).toBeInTheDocument();
  });

  it('calls onToggleTheme when theme button is clicked', () => {
    const handleToggleTheme = vi.fn();
    render(
      <ModalHeader
        title="Welcome"
        subtitle="Subtitle"
        onToggleTheme={handleToggleTheme}
        onToggleLocale={vi.fn()}
        themeIcon="☀️"
        themeTitle="Toggle theme"
        localeIcon="🇺🇸"
        localeTitle="Switch language"
      />
    );
    
    fireEvent.click(screen.getByTitle('Toggle theme'));
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleLocale when locale button is clicked', () => {
    const handleToggleLocale = vi.fn();
    render(
      <ModalHeader
        title="Welcome"
        subtitle="Subtitle"
        onToggleTheme={vi.fn()}
        onToggleLocale={handleToggleLocale}
        themeIcon="☀️"
        themeTitle="Toggle theme"
        localeIcon="🇺🇸"
        localeTitle="Switch language"
      />
    );
    
    fireEvent.click(screen.getByTitle('Switch language'));
    expect(handleToggleLocale).toHaveBeenCalledTimes(1);
  });
});
