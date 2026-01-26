import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useHomeEntranceAnimation } from '../../../src/hooks/home/useHomeEntranceAnimation';

describe('useHomeEntranceAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false initially', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);

    const { result } = renderHook(() => useHomeEntranceAnimation());

    // Before RAF callback is executed
    expect(result.current).toBe(false);
  });

  it('returns true after animation frame', () => {
    let rafCallback: FrameRequestCallback | null = null;
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallback = cb;
        return 0;
      });

    const { result } = renderHook(() => useHomeEntranceAnimation());

    act(() => {
      rafCallback?.(0);
    });

    expect(result.current).toBe(true);

    rafSpy.mockRestore();
  });

  it('calls requestAnimationFrame on mount', () => {
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 0);

    renderHook(() => useHomeEntranceAnimation());

    expect(rafSpy).toHaveBeenCalledTimes(1);

    rafSpy.mockRestore();
  });

  it('only triggers animation once', () => {
    let rafCallback: FrameRequestCallback | null = null;
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallback = cb;
        return 0;
      });

    const { result, rerender } = renderHook(() => useHomeEntranceAnimation());

    act(() => {
      rafCallback?.(0);
    });

    expect(result.current).toBe(true);

    // Re-render should not change the value
    rerender();
    expect(result.current).toBe(true);
    expect(rafSpy).toHaveBeenCalledTimes(1);

    rafSpy.mockRestore();
  });
});
