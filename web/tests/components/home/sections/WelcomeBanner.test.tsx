import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WelcomeBanner } from '../../../../src/components/home/sections/WelcomeBanner';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.title': 'Your time online under your control with',
        'home.titleBrand': 'Mindful Web',
        'home.subtitle': 'Track your time on websites',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('../../../../src/components/ui', () => ({
  Card: ({ children, style, noPadding }: { children: React.ReactNode; style?: React.CSSProperties; noPadding?: boolean }) => (
    <div data-testid="card" data-nopadding={noPadding} style={style}>
      {children}
    </div>
  ),
}));

describe('WelcomeBanner', () => {
  it('renders title text', () => {
    render(<WelcomeBanner isVisible />);

    expect(screen.getByText('Your time online under your control with')).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<WelcomeBanner isVisible />);

    expect(screen.getByText('Mindful Web')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<WelcomeBanner isVisible />);

    expect(screen.getByText('Track your time on websites')).toBeInTheDocument();
  });

  it('applies visible styles when isVisible is true', () => {
    render(<WelcomeBanner isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '1' });
    expect(card).toHaveStyle({ transform: 'translateY(0)' });
  });

  it('applies hidden styles when isVisible is false', () => {
    render(<WelcomeBanner isVisible={false} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '0' });
    expect(card).toHaveStyle({ transform: 'translateY(20px)' });
  });

  it('renders animated gradient bar', () => {
    const { container } = render(<WelcomeBanner isVisible />);

    const gradientBar = container.querySelector('div[style*="gradientMove"]');
    expect(gradientBar).toBeInTheDocument();
  });

  it('uses Card with noPadding', () => {
    render(<WelcomeBanner isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-nopadding', 'true');
  });

  it('brand name has primary color', () => {
    render(<WelcomeBanner isVisible />);

    const brandName = screen.getByText('Mindful Web');
    expect(brandName).toHaveStyle({ color: 'var(--color-primary)' });
  });
});
