import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileLogoutSection } from '../../../../src/components/profile/sections/ProfileLogoutSection';

vi.mock('../../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ProfileLogoutSection', () => {
  it('does not render for anonymous users', () => {
    const { container } = render(
      <ProfileLogoutSection
        isAuthenticated={false}
        isLoggingOut={false}
        isLogoutHovered={false}
        onLogout={() => undefined}
        onHoverChange={() => undefined}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders logout button for authenticated users', () => {
    render(
      <ProfileLogoutSection
        isAuthenticated
        isLoggingOut={false}
        isLogoutHovered={false}
        onLogout={() => undefined}
        onHoverChange={() => undefined}
      />
    );

    expect(screen.getByText('auth.logout')).toBeInTheDocument();
  });

  it('calls onHoverChange on hover', () => {
    const onHoverChange = vi.fn();
    render(
      <ProfileLogoutSection
        isAuthenticated
        isLoggingOut={false}
        isLogoutHovered={false}
        onLogout={() => undefined}
        onHoverChange={onHoverChange}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    expect(onHoverChange).toHaveBeenCalledWith(true);
    expect(onHoverChange).toHaveBeenCalledWith(false);
  });
});
