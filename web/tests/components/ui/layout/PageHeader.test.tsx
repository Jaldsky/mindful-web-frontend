import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../../../../src/components/ui';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Analytics" />);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Analytics" subtitle="Stats overview" />);
    expect(screen.getByText('Stats overview')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<PageHeader title="Analytics" />);
    const subtitle = container.querySelector('p');
    expect(subtitle).toBeNull();
  });

  it('renders right slot when provided', () => {
    render(<PageHeader title="Analytics" right={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('applies layout classes', () => {
    const { container } = render(
      <PageHeader title="Analytics" subtitle="Stats overview" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('flex', 'flex-col', 'gap-3');
  });
});
