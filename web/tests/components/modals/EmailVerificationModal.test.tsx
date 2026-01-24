import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailVerificationModal } from '../../../src/components/modals/EmailVerificationModal';

vi.mock('../../../src/hooks', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) =>
      params?.email ? `${key}:${params.email}` : key,
  }),
}));

describe('EmailVerificationModal', () => {
  it('renders title and subtitle when open', () => {
    render(
      <EmailVerificationModal
        isOpen
        email="user@example.com"
        code=""
        onCodeChange={vi.fn()}
        onClose={vi.fn()}
        onVerify={vi.fn()}
        onResend={vi.fn()}
        isVerifying={false}
        isResending={false}
        error=""
        info=""
        infoTone="success"
        isSuccess={false}
      />
    );

    expect(screen.getByText('profile.verifyEmailTitle')).toBeInTheDocument();
    expect(screen.getByText('profile.verifyEmailSubtitle:user@example.com')).toBeInTheDocument();
  });

  it('calls onVerify when submit is triggered', () => {
    const onVerify = vi.fn();
    render(
      <EmailVerificationModal
        isOpen
        email="user@example.com"
        code="123456"
        onCodeChange={vi.fn()}
        onClose={vi.fn()}
        onVerify={onVerify}
        onResend={vi.fn()}
        isVerifying={false}
        isResending={false}
        error=""
        info=""
        infoTone="success"
        isSuccess={false}
      />
    );

    fireEvent.click(screen.getByText('auth.verify'));
    expect(onVerify).toHaveBeenCalledTimes(1);
  });

  it('shows error and info messages', () => {
    render(
      <EmailVerificationModal
        isOpen
        email="user@example.com"
        code=""
        onCodeChange={vi.fn()}
        onClose={vi.fn()}
        onVerify={vi.fn()}
        onResend={vi.fn()}
        isVerifying={false}
        isResending={false}
        error="Invalid code"
        info="Too many attempts"
        infoTone="error"
        isSuccess={false}
      />
    );

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
    expect(screen.getByText('Too many attempts')).toBeInTheDocument();
  });
});
