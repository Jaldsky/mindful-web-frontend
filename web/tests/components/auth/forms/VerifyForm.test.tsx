import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VerifyForm } from '../../../../src/components/auth';
import { LocaleProvider } from '../../../../src/contexts';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LocaleProvider>{component}</LocaleProvider>);
};

describe('VerifyForm', () => {
  it('renders verify form with all fields', () => {
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/verification code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify email/i })).toBeInTheDocument();
  });

  it('populates email field with initialEmail', () => {
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
        initialEmail="test@example.com"
      />
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(
      <VerifyForm
        onSubmit={handleSubmit}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    
    // CodeInput uses multiple inputs, simulate typing in first input
    const codeInputs = document.querySelectorAll('input[type="text"][inputmode="numeric"]');
    expect(codeInputs.length).toBe(6);
    
    // Type code digit by digit
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });

  it('shows validation errors for empty fields', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={handleSubmit}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid email', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={handleSubmit}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    
    // Type code
    const codeInputs = document.querySelectorAll('input[type="text"][inputmode="numeric"]');
    codeInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: String(index + 1) } });
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      const errors = screen.queryAllByText(/invalid|email/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid code length', async () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={handleSubmit}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    
    // Type only 3 digits instead of 6
    const codeInputs = document.querySelectorAll('input[type="text"][inputmode="numeric"]');
    codeInputs.forEach((input, index) => {
      if (index < 3) {
        fireEvent.change(input, { target: { value: String(index + 1) } });
      }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify email/i }));

    await waitFor(() => {
      const errors = screen.queryAllByText(/invalid|code|required/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSwitchToResend when resend link clicked', () => {
    const handleSwitch = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={handleSwitch}
        onSwitchToLogin={vi.fn()}
      />
    );

    const resendLink = screen.getByText(/send code again|отправить код/i);
    fireEvent.click(resendLink);

    expect(handleSwitch).toHaveBeenCalled();
  });

  it('calls onBack when back button is clicked', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalled();
  });

  it('disables inputs when loading', () => {
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    
    // CodeInput uses multiple inputs
    const codeInputs = document.querySelectorAll('input[type="text"][inputmode="numeric"]');
    codeInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
        loading
      />
    );

    expect(screen.getByRole('button', { name: /verify email/i })).toBeDisabled();
  });

  it('renders back button when onBack provided', () => {
    const handleBack = vi.fn();
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
        onBack={handleBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalled();
  });

  it('limits code input to 6 characters', () => {
    renderWithProviders(
      <VerifyForm
        onSubmit={vi.fn()}
        onSwitchToResend={vi.fn()}
        onSwitchToLogin={vi.fn()}
      />
    );

    // CodeInput renders multiple input fields, find by label text
    const codeLabel = screen.getByText(/verification code/i);
    expect(codeLabel).toBeInTheDocument();
    
    // Find the input container or inputs
    const codeInputs = document.querySelectorAll('input[type="text"]');
    expect(codeInputs.length).toBeGreaterThan(0);
    
    // Check that inputs have maxLength attribute
    codeInputs.forEach(input => {
      expect(input).toHaveAttribute('maxLength', '1');
    });
  });
});
