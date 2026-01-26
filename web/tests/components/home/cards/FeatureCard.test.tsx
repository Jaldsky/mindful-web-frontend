import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Clock } from 'lucide-react';
import { FeatureCard } from '../../../../src/components/home/cards/FeatureCard';

describe('FeatureCard', () => {
  const defaultProps = {
    icon: <Clock size={20} />,
    title: 'Test Feature',
    description: 'Feature description text',
    color: { bg: '#E3F2FD', text: '#2196F3' },
  };

  it('renders title and description', () => {
    render(<FeatureCard {...defaultProps} />);

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Feature description text')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders icon container with custom colors', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);

    // Find the icon container (it has width 40px)
    const divs = container.querySelectorAll('div');
    const iconContainer = Array.from(divs).find(
      (div) => div.style.width === '40px'
    ) as HTMLElement;

    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer.style.backgroundColor).toBe('rgb(227, 242, 253)');
    expect(iconContainer.style.color).toBe('rgb(33, 150, 243)');
  });

  it('has correct layout structure', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ display: 'flex' });
    expect(wrapper).toHaveStyle({ alignItems: 'flex-start' });
  });
});
