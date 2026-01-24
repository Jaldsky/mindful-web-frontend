import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useEmailEditing } from '../../../src/hooks/profile/useEmailEditing';
import { STORAGE_KEYS } from '../../../src/constants';

const storageManagerMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('../../../src/contexts', () => ({
  storageManager: storageManagerMock,
}));

describe('useEmailEditing', () => {
  it('stores email locally for anonymous user', () => {
    const setEmail = vi.fn();
    const onVerificationNeeded = vi.fn();
    const { result } = renderHook(() =>
      useEmailEditing({
        isAuthenticated: false,
        email: null,
        setEmail,
        updateEmail: vi.fn().mockResolvedValue(undefined),
        onVerificationNeeded,
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setEmailInput('test@example.com');
    });

    act(() => {
      result.current.handleSaveEmail();
    });

    expect(storageManagerMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USER_EMAIL,
      'test@example.com'
    );
    expect(setEmail).toHaveBeenCalledWith('test@example.com');
    expect(onVerificationNeeded).not.toHaveBeenCalled();
  });

  it('calls updateEmail and opens verification for authenticated user', async () => {
    const updateEmail = vi.fn().mockResolvedValue(undefined);
    const onVerificationNeeded = vi.fn();
    const { result } = renderHook(() =>
      useEmailEditing({
        isAuthenticated: true,
        email: null,
        setEmail: vi.fn(),
        updateEmail,
        onVerificationNeeded,
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setEmailInput('user@example.com');
    });

    await act(async () => {
      result.current.handleSaveEmail();
      await Promise.resolve();
    });

    expect(updateEmail).toHaveBeenCalledWith('user@example.com');
    expect(onVerificationNeeded).toHaveBeenCalledWith('user@example.com');
  });
});
