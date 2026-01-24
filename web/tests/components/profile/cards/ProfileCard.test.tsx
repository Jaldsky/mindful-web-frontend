import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { User } from 'lucide-react';
import { ProfileCard } from '../../../../src/components/profile/cards/ProfileCard';

describe('ProfileCard', () => {
  it('renders icon, label and value', () => {
    render(
      <ProfileCard
        icon={User}
        label="Username"
        value="testuser"
        iconBgColor="#E3F2FD"
        iconColor="#2196F3"
      />
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('renders placeholder when value is null', () => {
    render(
      <ProfileCard
        icon={User}
        label="Username"
        value={null}
        iconBgColor="#E3F2FD"
        iconColor="#2196F3"
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders placeholder when value is undefined', () => {
    render(
      <ProfileCard
        icon={User}
        label="Username"
        value={undefined}
        iconBgColor="#E3F2FD"
        iconColor="#2196F3"
      />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies breakAll class when breakAll prop is true', () => {
    const { container } = render(
      <ProfileCard
        icon={User}
        label="Email"
        value="very-long-email@example.com"
        iconBgColor="#E8F5E9"
        iconColor="#4CAF50"
        breakAll
      />
    );

    const valueElement = container.querySelector('.break-all');
    expect(valueElement).toBeInTheDocument();
  });

  it('does not apply breakAll class by default', () => {
    const { container } = render(
      <ProfileCard
        icon={User}
        label="Username"
        value="testuser"
        iconBgColor="#E3F2FD"
        iconColor="#2196F3"
      />
    );

    const valueElement = container.querySelector('.break-all');
    expect(valueElement).not.toBeInTheDocument();
  });

  it('renders icon container with section-card wrapper', () => {
    const { container } = render(
      <ProfileCard
        icon={User}
        label="Username"
        value="testuser"
        iconBgColor="#E3F2FD"
        iconColor="#2196F3"
      />
    );

    const sectionCard = container.querySelector('.section-card');
    expect(sectionCard).toBeInTheDocument();
    
    // Verify icon container exists
    const iconContainers = container.querySelectorAll('.p-3.rounded-lg');
    expect(iconContainers.length).toBeGreaterThan(0);
  });
});
