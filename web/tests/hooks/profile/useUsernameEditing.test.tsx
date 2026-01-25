import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useUsernameEditing } from '../../../src/hooks/profile/useUsernameEditing';

describe('useUsernameEditing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts editing with current username', () => {
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: 'user@example.com',
        username: 'oldname',
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
    expect(result.current.usernameInput).toBe('oldname');
  });

  it('saves username and updates state on success', async () => {
    const setUsername = vi.fn();
    const updateUsername = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: null,
        username: 'old',
        setUsername,
        updateUsername,
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setUsernameInput('newname');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledWith('newname');
    expect(setUsername).toHaveBeenCalledWith('newname');
    expect(result.current.editingUsername).toBe(false);
  });

  it('shows error if username is too short', async () => {
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: null,
        username: null,
        setUsername: vi.fn(),
        updateUsername: vi.fn().mockResolvedValue(undefined),
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setUsernameInput('ab');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(result.current.usernameError).toBe('auth.errors.usernameTooShort');
  });

  it('blocks rapid username changes with cooldown', async () => {
    const updateUsername = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: null,
        username: null,
        setUsername: vi.fn(),
        updateUsername,
        t: (key: string, params?: Record<string, string | number>) =>
          params?.seconds ? `${key}:${params.seconds}` : key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setUsernameInput('firstchange');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setUsernameInput('secondchange');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledTimes(1);
    expect(result.current.usernameError).toContain('profile.usernameChangeCooldown');
  });

  it('allows username change after cooldown expires', async () => {
    const updateUsername = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: null,
        username: null,
        setUsername: vi.fn(),
        updateUsername,
        t: (key: string) => key,
        setServerError: vi.fn(),
      })
    );

    act(() => {
      result.current.setUsernameInput('firstchange');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(31000);
    });

    act(() => {
      result.current.setUsernameInput('secondchange');
    });

    await act(async () => {
      await result.current.handleSaveUsername();
    });

    expect(updateUsername).toHaveBeenCalledTimes(2);
  });

  it('handles server error on save', async () => {
    const setServerError = vi.fn();
    const updateUsername = vi.fn().mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() =>
      useUsernameEditing({
        isAuthenticated: true,
        email: null,
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

    expect(setServerError).toHaveBeenCalledWith('Network Error');
  });
});
