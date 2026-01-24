import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProfileEntranceAnimation } from '../../../src/hooks/profile/useProfileEntranceAnimation';

describe('useProfileEntranceAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('animates children when visible', () => {
    let rafCallback: FrameRequestCallback | null = null;
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        rafCallback = cb;
        return 0;
      });

    const { result } = renderHook(() => useProfileEntranceAnimation());

    const container = document.createElement('div');
    const childOne = document.createElement('div');
    const childTwo = document.createElement('div');
    container.appendChild(childOne);
    container.appendChild(childTwo);
    result.current.containerRef.current = container;

    act(() => {
      rafCallback?.(0);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(childOne.style.opacity).toBe('1');
    expect(childTwo.style.opacity).toBe('1');

    rafSpy.mockRestore();
  });
});
