import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../../../../src/components/ui';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Card Title">Content</Card>);
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default padding', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass('p-6');
  });

  it('removes padding when noPadding is true', () => {
    const { container } = render(<Card noPadding>Content</Card>);
    const card = container.firstChild;
    
    expect(card).not.toHaveClass('p-6');
  });

  it('applies default styling classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass('bg-background-primary');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('border');
  });

  it('merges custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('rounded-xl');
  });

  it('renders title with correct styling', () => {
    render(<Card title="My Title">Content</Card>);
    const title = screen.getByText('My Title');
    
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-bold');
    expect(title).toHaveClass('mb-4');
  });

  it('accepts HTML attributes', () => {
    const { container } = render(
      <Card data-testid="custom-card">Content</Card>
    );
    const card = container.firstChild;
    
    expect(card).toHaveAttribute('data-testid', 'custom-card');
  });
});
