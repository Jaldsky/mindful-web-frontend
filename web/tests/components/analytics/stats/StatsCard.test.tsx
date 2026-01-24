import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '../../../../src/components/analytics/stats/StatsCard';
import { Clock } from 'lucide-react';

describe('StatsCard', () => {
  it('renders with label and value', () => {
    render(<StatsCard icon={Clock} label="Total Time" value="2h 30m" />);
    
    expect(screen.getByText('Total Time')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(
      <StatsCard icon={Clock} label="Test" value="123" />
    );
    
    // Icon component should be rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with numeric value', () => {
    render(<StatsCard icon={Clock} label="Count" value={42} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('applies success variant colors', () => {
    const { container } = render(
      <StatsCard
        icon={Clock}
        label="Custom"
        value="test"
        variant="success"
      />
    );
    
    const iconContainer = container.querySelector('.bg-green-100');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('text-green-600');
  });

  it('uses primary variant by default', () => {
    const { container } = render(
      <StatsCard icon={Clock} label="Default" value="test" />
    );
    
    const iconContainer = container.querySelector('.bg-blue-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('applies warning variant colors', () => {
    const { container } = render(
      <StatsCard icon={Clock} label="Warning" value="test" variant="warning" />
    );
    
    const iconContainer = container.querySelector('.bg-orange-100');
    expect(iconContainer).toBeInTheDocument();
  });
});
