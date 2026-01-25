import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
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

  it('blocks rapid email changes with cooldown', async () => {
    const updateEmail = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useEmailEditing({
        isAuthenticated: true,
        email: null,
        setEmail: vi.fn(),
        updateEmail,
        onVerificationNeeded: vi.fn(),
        t: (key: string, params?: Record<string, string | number>) =>
          params?.seconds ? `${key}:${params.seconds}` : key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setEmailInput('first@example.com');
    });

    await act(async () => {
      result.current.handleSaveEmail();
      await Promise.resolve();
    });

    expect(updateEmail).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setEmailInput('second@example.com');
    });

    act(() => {
      result.current.handleSaveEmail();
    });

    expect(updateEmail).toHaveBeenCalledTimes(1);
    expect(result.current.emailError).toContain('profile.emailChangeCooldown');
  });

  it('allows email change after cooldown expires', async () => {
    const updateEmail = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useEmailEditing({
        isAuthenticated: true,
        email: null,
        setEmail: vi.fn(),
        updateEmail,
        onVerificationNeeded: vi.fn(),
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setEmailInput('first@example.com');
    });

    await act(async () => {
      result.current.handleSaveEmail();
      await Promise.resolve();
    });

    expect(updateEmail).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(31000);
    });

    act(() => {
      result.current.setEmailInput('second@example.com');
    });

    await act(async () => {
      result.current.handleSaveEmail();
      await Promise.resolve();
    });

    expect(updateEmail).toHaveBeenCalledTimes(2);
  });
});
