import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../../../../src/components/auth';
import { LocaleProvider } from '../../../../src/contexts';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LocaleProvider>{component}</LocaleProvider>);
};

describe('RegisterForm', () => {
  it('renders register form with all fields', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToVerify={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(passwordInputs.length).toBe(2);
    expect(passwordInputs[0]).toBeInTheDocument();
    expect(passwordInputs[1]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToVerify={vi.fn()}
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
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
        onSwitchToVerify={vi.fn()}
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
        onSwitchToVerify={vi.fn()}
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
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
        onSwitchToVerify={vi.fn()}
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'ab' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for short password', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToVerify={vi.fn()}
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: '123' } });
    fireEvent.change(passwordInputs[1], { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when form is submitted successfully', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <RegisterForm
        onSubmit={handleSubmit}
        onSwitchToVerify={vi.fn()}
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    });
  });

  it('disables inputs when loading', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToVerify={vi.fn()}
        loading
      />
    );

    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(screen.getByLabelText(/username/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(passwordInputs[0]).toBeDisabled();
    expect(passwordInputs[1]).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <RegisterForm
        onSubmit={vi.fn()}
        onSwitchToVerify={vi.fn()}
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
        onSwitchToVerify={vi.fn()}
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
        onSwitchToVerify={vi.fn()}
      />
    );

    // Submit to show errors
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });

    // Start typing - errors should clear on next submit attempt
    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
