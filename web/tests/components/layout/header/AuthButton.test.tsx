import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthButton } from '../../../../src/components/layout';
import { AuthProvider, LocaleProvider, ThemeProvider } from '../../../../src/contexts';

const renderAuthButton = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <AuthButton />
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
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
