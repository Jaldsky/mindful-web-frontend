import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileCardHeader } from '../../../../src/components/profile/layout/ProfileCardHeader';

describe('ProfileCardHeader', () => {
  it('renders title and subtitle', () => {
    render(<ProfileCardHeader title="Profile" subtitle="Manage profile settings" />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Manage profile settings')).toBeInTheDocument();
  });

  it('renders without subtitle', () => {
    render(<ProfileCardHeader title="Profile" />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('Manage profile settings')).not.toBeInTheDocument();
  });
});
