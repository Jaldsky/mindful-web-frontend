import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../../../../src/components/layout/footer/Footer';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'footer.terms': 'Terms of Service',
        'footer.privacy': 'Privacy Policy',
        'footer.reportBug': 'Report a bug',
      };
      return translations[key] || key;
    },
  }),
}));

const renderFooter = () => {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
};

describe('Footer', () => {
  it('renders copyright with current year', () => {
    renderFooter();

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Mindful Web`)).toBeInTheDocument();
  });

  it('renders Terms of Service link', () => {
    renderFooter();

    const link = screen.getByText('Terms of Service');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/terms');
  });

  it('renders Privacy Policy link', () => {
    renderFooter();

    const link = screen.getByText('Privacy Policy');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('renders Report Bug link', () => {
    renderFooter();

    const link = screen.getByText('Report a bug');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/Jaldsky/mindful-web-frontend/issues');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('changes link color on hover', () => {
    renderFooter();

    const link = screen.getByText('Report a bug') as HTMLElement;
    fireEvent.mouseEnter(link);
    expect(link.style.color).toBe('var(--color-primary)');
  });

  it('resets link color on mouse leave', () => {
    renderFooter();

    const link = screen.getByText('Report a bug') as HTMLElement;
    fireEvent.mouseEnter(link);
    fireEvent.mouseLeave(link);
    expect(link.style.color).toBe('var(--color-text-secondary)');
  });
});
