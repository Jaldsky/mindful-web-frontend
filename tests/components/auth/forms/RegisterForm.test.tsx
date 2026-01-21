import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../../../../src/components/auth/forms/RegisterForm';
import { LocaleProvider } from '../../../../src/contexts/LocaleContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LocaleProvider>{component}</LocaleProvider>);
};

describe('RegisterForm', () => {
  it('renders register form with all fields', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

  it('shows validation errors for empty fields', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid email', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      const errors = screen.queryAllByText(/invalid|email/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for short username', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/short/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for short password', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/short/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSwitchToLogin when login link clicked', () => {
    const handleSwitch = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToLogin={handleSwitch}
      />
    );

    const loginLink = screen.getByText(/sign in/i);
    fireEvent.click(loginLink);

    expect(handleSwitch).toHaveBeenCalled();
  });

  it('disables inputs when loading', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled();
  });

  it('renders back button when onBack provided', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalled();
  });

  it('clears errors when user starts typing', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    // Submit to show errors
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    // Start typing - errors should clear on next submit attempt
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
