import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturesSection } from '../../../../src/components/home/sections/FeaturesSection';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.sections.features': 'Features',
        'home.sections.featuresDescription': 'Key tools to control your time online.',
        'home.features.tracking.title': 'Time Tracking',
        'home.features.tracking.description': 'Monitor time on all websites',
        'home.features.analytics.title': 'Analytics',
        'home.features.analytics.description': 'Charts and reports',
        'home.features.mindful.title': 'Mindful Usage',
        'home.features.mindful.description': 'Manage your time consciously',
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

describe('FeaturesSection', () => {
  it('renders section title', () => {
    render(<FeaturesSection isVisible />);

    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<FeaturesSection isVisible />);

    expect(screen.getByText('Key tools to control your time online.')).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<FeaturesSection isVisible />);

    expect(screen.getByText('Time Tracking')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Mindful Usage')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeaturesSection isVisible />);

    expect(screen.getByText('Monitor time on all websites')).toBeInTheDocument();
    expect(screen.getByText('Charts and reports')).toBeInTheDocument();
    expect(screen.getByText('Manage your time consciously')).toBeInTheDocument();
  });

  it('applies visible styles when isVisible is true', () => {
    render(<FeaturesSection isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '1' });
    expect(card).toHaveStyle({ transform: 'translateY(0)' });
  });

  it('applies hidden styles when isVisible is false', () => {
    render(<FeaturesSection isVisible={false} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '0' });
    expect(card).toHaveStyle({ transform: 'translateY(20px)' });
  });

  it('has transition delay for staggered animation', () => {
    render(<FeaturesSection isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ transition: 'opacity 0.4s ease 100ms, transform 0.4s ease 100ms' });
  });

  it('renders feature icons', () => {
    const { container } = render(<FeaturesSection isVisible />);

    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(4); // section header icon + 3 feature icons
  });
});
