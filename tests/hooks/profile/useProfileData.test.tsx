import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProfileData } from '../../../src/hooks/profile/useProfileData';
import { STORAGE_KEYS } from '../../../src/constants';

const storageManagerMock = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));

vi.mock('../../../src/contexts', () => ({
  storageManager: storageManagerMock,
}));

describe('useProfileData', () => {
  beforeEach(() => {
    storageManagerMock.getItem.mockReset();
  });

  it('uses auth user data when authenticated', () => {
    storageManagerMock.getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEYS.TIMEZONE) return 'UTC';
      return null;
    });

    const { result } = renderHook(() =>
      useProfileData({
        isAuthenticated: true,
        authUser: {
          user_id: 'u1',
          username: 'alice',
          email: 'alice@example.com',
          created_at: '2024-01-01',
          timezone: 'UTC',
        },
        detectedTimezone: 'Europe/Berlin',
      })
    );

    expect(result.current.email).toBe('alice@example.com');
    expect(result.current.username).toBe('alice');
    expect(result.current.timezone).toBe('UTC');
  });

  it('falls back to storage when anonymous', () => {
    storageManagerMock.getItem.mockImplementation((key: string) => {
      if (key === STORAGE_KEYS.USER_EMAIL) return 'anon@example.com';
      if (key === STORAGE_KEYS.USERNAME) return 'anon';
      if (key === STORAGE_KEYS.TIMEZONE) return null;
      return null;
    });

    const { result } = renderHook(() =>
      useProfileData({
        isAuthenticated: false,
        authUser: null,
        detectedTimezone: 'Europe/Berlin',
      })
    );

    expect(result.current.email).toBe('anon@example.com');
    expect(result.current.username).toBe('anon');
    expect(result.current.timezone).toBe('Europe/Berlin');
  });
});
