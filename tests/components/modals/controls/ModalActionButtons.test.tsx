import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalActionButtons } from '../../../../src/components/modals/controls/ModalActionButtons';

describe('ModalActionButtons', () => {
  it('renders both buttons with correct text', () => {
    render(
      <ModalActionButtons
        onSignIn={vi.fn()}
        onAnonymous={vi.fn()}
        disabled={false}
        signInText="Sign In"
        anonymousText="Continue Anonymously"
      />
    );
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Continue Anonymously')).toBeInTheDocument();
  });

  it('calls onSignIn when sign in button is clicked', () => {
    const handleSignIn = vi.fn();
    render(
      <ModalActionButtons
        onSignIn={handleSignIn}
        onAnonymous={vi.fn()}
        disabled={false}
        signInText="Sign In"
        anonymousText="Continue Anonymously"
      />
    );
    
    fireEvent.click(screen.getByText('Sign In'));
    expect(handleSignIn).toHaveBeenCalledTimes(1);
  });

  it('calls onAnonymous when anonymous button is clicked', () => {
    const handleAnonymous = vi.fn();
    render(
      <ModalActionButtons
        onSignIn={vi.fn()}
        onAnonymous={handleAnonymous}
        disabled={false}
        signInText="Sign In"
        anonymousText="Continue Anonymously"
      />
    );
    
    fireEvent.click(screen.getByText('Continue Anonymously'));
    expect(handleAnonymous).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when disabled prop is true', () => {
    render(
      <ModalActionButtons
        onSignIn={vi.fn()}
        onAnonymous={vi.fn()}
        disabled={true}
        signInText="Sign In"
        anonymousText="Continue Anonymously"
      />
    );
    
    const signInButton = screen.getByText('Sign In');
    const anonymousButton = screen.getByText('Continue Anonymously');
    
    expect(signInButton).toBeDisabled();
    expect(anonymousButton).toBeDisabled();
  });
});
