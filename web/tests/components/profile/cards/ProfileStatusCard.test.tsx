import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileStatusCard } from '../../../../src/components/profile/cards/ProfileStatusCard';

describe('ProfileStatusCard', () => {
  it('renders title and status label', () => {
    render(<ProfileStatusCard title="Account Status" statusLabel="Authenticated" />);

    expect(screen.getByText('Account Status')).toBeInTheDocument();
    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  it('renders shield icon', () => {
    const { container } = render(
      <ProfileStatusCard title="Account Status" statusLabel="Authenticated" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct styling to status label', () => {
    render(<ProfileStatusCard title="Account Status" statusLabel="Authenticated" />);

    const statusLabel = screen.getByText('Authenticated');
    expect(statusLabel).toHaveClass('px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium');
  });
});
