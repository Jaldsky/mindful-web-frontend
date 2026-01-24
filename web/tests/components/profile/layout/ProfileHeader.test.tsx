import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileHeader } from '../../../../src/components/profile/layout/ProfileHeader';

describe('ProfileHeader', () => {
  it('renders title and subtitle', () => {
    render(<ProfileHeader title="Profile" subtitle="Your profile information" />);

    expect(screen.getByText(/Profile/)).toBeInTheDocument();
    expect(screen.getByText('Your profile information')).toBeInTheDocument();
  });

  it('includes emoji in title', () => {
    render(<ProfileHeader title="Profile" subtitle="Your profile information" />);

    expect(screen.getByText(/👤/)).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const { container } = render(
      <ProfileHeader title="Profile" subtitle="Your profile information" />
    );

    const header = container.querySelector('div');
    expect(header).toHaveClass('text-center', 'mb-8');
  });
});
