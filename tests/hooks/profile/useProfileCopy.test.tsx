import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProfileCopy } from '../../../src/hooks/profile/useProfileCopy';

describe('useProfileCopy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies userId and resets copied flag', async () => {
    const { result } = renderHook(() => useProfileCopy({ userId: 'user-1' }));

    await act(async () => {
      await result.current.handleCopyUserId();
    });

    expect(result.current.copiedUserId).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copiedUserId).toBe(false);
  });
});
