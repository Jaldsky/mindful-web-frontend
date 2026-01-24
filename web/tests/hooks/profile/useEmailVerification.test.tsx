import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useEmailVerification } from '../../../src/hooks/profile/useEmailVerification';

describe('useEmailVerification', () => {
  it('shows invalid code message when verification fails', async () => {
    const verifyEmail = vi.fn().mockRejectedValue({
      message: 'Error',
      details: { code: 'VERIFICATION_CODE_INVALID', message: 'Verification code is invalid' },
    });
    const { result } = renderHook(() =>
      useEmailVerification({
        verifyEmail,
        resendCode: vi.fn().mockResolvedValue(undefined),
        reloadProfile: vi.fn().mockResolvedValue(undefined),
        setEmail: vi.fn(),
        t: (key: string) => key,
      })
    );

    act(() => {
      result.current.openVerification('user@example.com', 'profile.verifyEmailInfo');
      result.current.setVerificationCode('123456');
    });

    await act(async () => {
      await result.current.handleVerifyEmail();
    });

    expect(result.current.verificationError).toBe('auth.errors.codeInvalid');
  });

  it('uses server message when resend is rate limited', async () => {
    const resendCode = vi.fn().mockRejectedValue({
      message: 'Error',
      details: { code: 'TOO_MANY_ATTEMPTS', message: 'Too many attempts. Please try again later' },
    });
    const { result } = renderHook(() =>
      useEmailVerification({
        verifyEmail: vi.fn().mockResolvedValue(undefined),
        resendCode,
        reloadProfile: vi.fn().mockResolvedValue(undefined),
        setEmail: vi.fn(),
        t: (key: string) => key,
      })
    );

    act(() => {
      result.current.openVerification('user@example.com', 'profile.verifyEmailInfo');
    });

    await act(async () => {
      await result.current.handleResendCode();
    });

    expect(result.current.verificationInfoTone).toBe('error');
    expect(result.current.verificationInfo).toBe('Too many attempts. Please try again later');
    expect(result.current.verificationError).toBe('');
  });
});
