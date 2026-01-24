import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProfileEditing } from '../../../src/hooks/profile/useProfileEditing';
import { STORAGE_KEYS } from '../../../src/constants';

const storageManagerMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('../../../src/contexts', () => ({
  storageManager: storageManagerMock,
}));

describe('useProfileEditing', () => {
  it('starts edit for username when authenticated', () => {
    const { result } = renderHook(() =>
      useProfileEditing({
        isAuthenticated: true,
        email: 'user@example.com',
        setEmail: vi.fn(),
        username: 'user1',
        setUsername: vi.fn(),
        updateUsername: vi.fn().mockResolvedValue(undefined),
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.startEditUsername();
    });

    expect(result.current.editingUsername).toBe(true);
    expect(result.current.usernameInput).toBe('user1');
  });

  it('validates and saves email to storage', () => {
    const setEmail = vi.fn();
    const { result } = renderHook(() =>
      useProfileEditing({
        isAuthenticated: true,
        email: null,
        setEmail,
        username: null,
        setUsername: vi.fn(),
        updateUsername: vi.fn().mockResolvedValue(undefined),
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
    expect(result.current.emailError).toBe('');
  });

  it('handles username update failure by setting server error', async () => {
    const setServerError = vi.fn();
    const updateUsername = vi.fn().mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() =>
      useProfileEditing({
        isAuthenticated: true,
        email: null,
        setEmail: vi.fn(),
        username: 'old',
        setUsername: vi.fn(),
        updateUsername,
        t: (key: string) => key,
        setServerError,
      })
    );

    act(() => {
      result.current.setUsernameInput('newname');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledWith('newname');
    expect(setServerError).toHaveBeenCalledWith('Network Error');
    expect(result.current.usernameError).toBe('');
  });
});
