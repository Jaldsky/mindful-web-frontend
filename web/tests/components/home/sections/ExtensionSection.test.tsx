import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExtensionSection } from '../../../../src/components/home/sections/ExtensionSection';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.sections.extension': 'Download Extension',
        'home.extension.description': 'Install the extension to track time on websites.',
        'home.extension.users': 'users',
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

describe('ExtensionSection', () => {
  it('renders section title', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('Download Extension')).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('Install the extension to track time on websites.')).toBeInTheDocument();
  });

  it('renders Chrome button', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('Chrome')).toBeInTheDocument();
  });

  it('renders Firefox button', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('Firefox')).toBeInTheDocument();
  });

  it('renders Edge button', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('Edge')).toBeInTheDocument();
  });

  it('renders users counter', () => {
    render(<ExtensionSection isVisible />);

    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('users')).toBeInTheDocument();
  });

  it('Chrome button is a link with correct href', () => {
    render(<ExtensionSection isVisible />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/Jaldsky/mindful-web-extensions/releases');
  });

  it('Firefox and Edge buttons are disabled', () => {
    render(<ExtensionSection isVisible />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('applies visible styles when isVisible is true', () => {
    render(<ExtensionSection isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '1' });
    expect(card).toHaveStyle({ transform: 'translateY(0)' });
  });

  it('applies hidden styles when isVisible is false', () => {
    render(<ExtensionSection isVisible={false} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ opacity: '0' });
    expect(card).toHaveStyle({ transform: 'translateY(20px)' });
  });

  it('has transition delay for staggered animation', () => {
    render(<ExtensionSection isVisible />);

    const card = screen.getByTestId('card');
    expect(card).toHaveStyle({ transition: 'opacity 0.4s ease 200ms, transform 0.4s ease 200ms' });
  });
});
