import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../../../src/components/ui';

describe('EmptyState', () => {
  it('renders with message', () => {
    render(<EmptyState message="No data available" />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState message="Test message" className="custom-class" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('has correct default styles', () => {
    const { container } = render(<EmptyState message="Test" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('bg-blue-50');
    expect(element).toHaveClass('text-blue-700');
    expect(element).toHaveClass('rounded-lg');
  });
});
