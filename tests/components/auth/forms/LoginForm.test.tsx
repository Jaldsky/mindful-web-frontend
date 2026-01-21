import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../../../src/components/auth';
import { LocaleProvider } from '../../../../src/contexts';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LocaleProvider>{component}</LocaleProvider>);
};

describe('LoginForm', () => {
  it('renders login form with fields', () => {
    renderWithProviders(
      <LoginForm
        onSubmit={vi.fn()}
        onSwitchToRegister={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls onSubmit with valid credentials', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <LoginForm
        onSubmit={handleSubmit}
        onSwitchToRegister={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('shows validation errors for empty fields', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <LoginForm
        onSubmit={handleSubmit}
        onSwitchToRegister={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSwitchToRegister when register link clicked', () => {
    const handleSwitch = vi.fn();
    renderWithProviders(
      <LoginForm
        onSubmit={vi.fn()}
        onSwitchToRegister={handleSwitch}
      />
    );

    const registerLink = screen.getByText(/sign up/i);
    fireEvent.click(registerLink);

    expect(handleSwitch).toHaveBeenCalled();
  });

  it('disables inputs when loading', () => {
    renderWithProviders(
      <LoginForm
        onSubmit={vi.fn()}
        onSwitchToRegister={vi.fn()}
        loading
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
  });

  it('renders back button when onBack provided', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <LoginForm
        onSubmit={vi.fn()}
        onSwitchToRegister={vi.fn()}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalled();
  });
});
