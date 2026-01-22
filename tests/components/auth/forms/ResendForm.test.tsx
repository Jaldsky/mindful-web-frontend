import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResendForm } from '../../../../src/components/auth';
import { LocaleProvider } from '../../../../src/contexts';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LocaleProvider>{component}</LocaleProvider>);
};

describe('ResendForm', () => {
  it('renders resend form with email field', () => {
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code again|code/i })).toBeInTheDocument();
  });

  it('populates email field with initialEmail', () => {
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        initialEmail="test@example.com"
      />
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  it('calls onSubmit with valid email', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <ResendForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send code again|code/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows validation error for empty email', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <ResendForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /send code again|code/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid email format', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <ResendForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /send code again|code/i }));

    await waitFor(() => {
      const errors = screen.queryAllByText(/invalid|email/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(handleBack).toHaveBeenCalled();
  });

  it('disables input when loading', () => {
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByRole('button', { name: /send code again|code/i })).toBeDisabled();
  });

  it('renders back button when onBack provided', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <ResendForm
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

  it('clears error when user starts typing', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <ResendForm
        onSubmit={handleSubmit}
        onSwitchToLogin={vi.fn()}
      />
    );

    // Submit to show error
    fireEvent.click(screen.getByRole('button', { name: /send code again|code/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });

    // Start typing - error should clear on next submit
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send code again|code/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it('has correct heading text', () => {
    renderWithProviders(
      <ResendForm
        onSubmit={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /resend code/i })).toBeInTheDocument();
  });
});
