import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileAnonymousCard } from '../../../../src/components/profile/cards/ProfileAnonymousCard';

describe('ProfileAnonymousCard', () => {
  it('renders title, description and button', () => {
    const mockOnSignIn = vi.fn();
    render(
      <ProfileAnonymousCard
        title="Anonymous Session"
        description="You are using anonymously"
        buttonLabel="Sign In"
        onSignInClick={mockOnSignIn}
      />
    );

    expect(screen.getByText('Anonymous Session')).toBeInTheDocument();
    expect(screen.getByText('You are using anonymously')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('calls onSignInClick when button is clicked', () => {
    const mockOnSignIn = vi.fn();
    render(
      <ProfileAnonymousCard
        title="Anonymous Session"
        description="You are using anonymously"
        buttonLabel="Sign In"
        onSignInClick={mockOnSignIn}
      />
    );

    const button = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(button);

    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders hash icon', () => {
    const mockOnSignIn = vi.fn();
    const { container } = render(
      <ProfileAnonymousCard
        title="Anonymous Session"
        description="You are using anonymously"
        buttonLabel="Sign In"
        onSignInClick={mockOnSignIn}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const mockOnSignIn = vi.fn();
    render(
      <ProfileAnonymousCard
        title="Anonymous Session"
        description="You are using anonymously"
        buttonLabel="Sign In"
        onSignInClick={mockOnSignIn}
      />
    );

    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toHaveClass('btn-base', 'btn-login', 'mx-auto');
  });
});
