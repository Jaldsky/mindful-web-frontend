import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../../../../src/components/ui/layout/PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Dashboard" subtitle="Stats overview" />);
    expect(screen.getByText('Stats overview')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<PageHeader title="Dashboard" />);
    const subtitle = container.querySelector('p');
    expect(subtitle).toBeNull();
  });

  it('renders right slot when provided', () => {
    render(<PageHeader title="Dashboard" right={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('applies layout classes', () => {
    const { container } = render(
      <PageHeader title="Dashboard" subtitle="Stats overview" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('flex', 'flex-col', 'gap-3');
  });
});
