import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProfileLogout } from '../../../src/hooks/profile/useProfileLogout';

describe('useProfileLogout', () => {
  it('calls logout and navigates on success', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const navigate = vi.fn();
    const { result } = renderHook(() => useProfileLogout({ logout, navigate }));

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/', { replace: true });
    expect(result.current.isLoggingOut).toBe(false);
  });
});
