import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModalAnimation } from '../../../../src/components/modals/hooks/useModalAnimation';

describe('useModalAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with isVisible false and isTransitioning false', () => {
    const { result } = renderHook(() => useModalAnimation(false));
    
    expect(result.current.isVisible).toBe(false);
    expect(result.current.isTransitioning).toBe(false);
  });

  it('sets isVisible to true when isOpen is true', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useModalAnimation(isOpen),
      { initialProps: { isOpen: false } }
    );
    
    expect(result.current.isVisible).toBe(false);
    
    rerender({ isOpen: true });
    
    act(() => {
      vi.runAllTimers();
    });
    
    expect(result.current.isVisible).toBe(true);
  });

  it('handleTransition sets isTransitioning and calls callback', () => {
    const { result } = renderHook(() => useModalAnimation(true));
    const callback = vi.fn();
    
    act(() => {
      result.current.handleTransition(callback);
    });
    
    expect(result.current.isTransitioning).toBe(true);
    expect(callback).not.toHaveBeenCalled();
    
    act(() => {
      vi.runAllTimers();
    });
    
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('sets isVisible to false when isOpen changes to false', () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useModalAnimation(isOpen),
      { initialProps: { isOpen: true } }
    );
    
    act(() => {
      vi.runAllTimers();
    });
    
    expect(result.current.isVisible).toBe(true);
    
    rerender({ isOpen: false });
    
    expect(result.current.isVisible).toBe(false);
  });
});
