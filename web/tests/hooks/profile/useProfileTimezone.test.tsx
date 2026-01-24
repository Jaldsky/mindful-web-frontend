import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProfileTimezone } from '../../../src/hooks/profile/useProfileTimezone';
import { STORAGE_KEYS } from '../../../src/constants';

const storageManagerMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('../../../src/contexts', () => ({
  storageManager: storageManagerMock,
}));

describe('useProfileTimezone', () => {
  it('stores timezone and updates state', () => {
    const setTimezone = vi.fn();
    const { result } = renderHook(() => useProfileTimezone({ setTimezone }));

    result.current.handleTimezoneChange('Europe/Berlin');

    expect(storageManagerMock.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.TIMEZONE,
      'Europe/Berlin'
    );
    expect(setTimezone).toHaveBeenCalledWith('Europe/Berlin');
  });
});
