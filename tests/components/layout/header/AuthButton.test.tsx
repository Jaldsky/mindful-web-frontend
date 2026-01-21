import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthButton } from '../../../../src/components/layout/header/AuthButton';
import { AuthProvider } from '../../../../src/contexts/AuthContext';

const renderAuthButton = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthButton />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthButton', () => {
  it('renders sign in button when not authenticated', () => {
    renderAuthButton();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders a link to auth page', () => {
    renderAuthButton();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/auth');
  });

  it('displays login icon', () => {
    renderAuthButton();
    const link = screen.getByRole('link');
    expect(link.querySelector('svg')).toBeInTheDocument();
  });
});
