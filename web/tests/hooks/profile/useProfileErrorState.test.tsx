import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProfileErrorState } from '../../../src/hooks/profile/useProfileErrorState';

describe('useProfileErrorState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows and hides error state', () => {
    const { result } = renderHook(() => useProfileErrorState());

    act(() => {
      result.current.setServerError('Error');
    });

    expect(result.current.serverError).toBe('Error');
    expect(result.current.isErrorVisible).toBe(true);

    act(() => {
      result.current.hideError();
    });

    expect(result.current.isErrorVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.serverError).toBeNull();
  });
});
