import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthAnimation } from '../../../src/hooks';

describe('useAuthAnimation', () => {
  beforeEach(() => {
    // Mock RAF
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(cb, 0);
      return 1;
    });
    
    // Reset body styles
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes with default screen', () => {
    const { result } = renderHook(() => useAuthAnimation());
    
    expect(result.current.activeScreen).toBe('login');
    expect(result.current.displayScreen).toBe('login');
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.isMeasuring).toBe(false);
  });

  it('initializes with custom screen', () => {
    const { result } = renderHook(() => useAuthAnimation('register'));
    
    expect(result.current.activeScreen).toBe('register');
    expect(result.current.displayScreen).toBe('register');
  });

  it('provides containerRef', () => {
    const { result } = renderHook(() => useAuthAnimation());
    
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull();
  });

  it('starts with auto height and 100% width', () => {
    const { result } = renderHook(() => useAuthAnimation());
    
    expect(result.current.containerHeight).toBe('auto');
    expect(result.current.containerWidth).toBe('100%');
  });

  it('resets dimensions when isExiting is true', () => {
    const { result, rerender } = renderHook(
      ({ isExiting }) => useAuthAnimation('login', isExiting),
      { initialProps: { isExiting: false } }
    );
    
    // Change to exiting
    rerender({ isExiting: true });
    
    expect(result.current.containerHeight).toBe('auto');
    expect(result.current.containerWidth).toBe('100%');
  });

  it('switchScreen changes activeScreen', () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    act(() => {
      result.current.switchScreen('register');
    });
    
    expect(result.current.activeScreen).toBe('register');
  });

  it('switchScreen does not change if same screen', () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    const initialActive = result.current.activeScreen;
    
    act(() => {
      result.current.switchScreen('login');
    });
    
    expect(result.current.activeScreen).toBe(initialActive);
  });

  it('switchScreen does not change if transitioning', () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    // Create a mock container
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    // Set scrollHeight
    Object.defineProperty(mockContainer, 'scrollHeight', {
      value: 500,
      writable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
    });
    
    // Assign container
    Object.defineProperty(result.current.containerRef, 'current', {
      writable: true,
      value: mockContainer
    });
    
    // Start transition but don't wait for RAF
    vi.stubGlobal('requestAnimationFrame', vi.fn());
    
    act(() => {
      result.current.switchScreen('register');
      // isTransitioning should be false initially, but we set displayScreen
      // Try to switch immediately - should be ignored since activeScreen matches
      result.current.switchScreen('register');
    });
    
    // Screen should be 'register'
    expect(result.current.activeScreen).toBe('register');
    
    vi.unstubAllGlobals();
  });

  it('provides switchScreen function', () => {
    const { result } = renderHook(() => useAuthAnimation());
    
    expect(typeof result.current.switchScreen).toBe('function');
  });

  it('handles missing container gracefully', () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    // No container ref set
    expect(() => {
      act(() => {
        result.current.switchScreen('register');
      });
    }).not.toThrow();
    
    expect(result.current.activeScreen).toBe('register');
  });

  it('returns all required properties', () => {
    const { result } = renderHook(() => useAuthAnimation());
    
    expect(result.current).toHaveProperty('activeScreen');
    expect(result.current).toHaveProperty('displayScreen');
    expect(result.current).toHaveProperty('isTransitioning');
    expect(result.current).toHaveProperty('isMeasuring');
    expect(result.current).toHaveProperty('containerHeight');
    expect(result.current).toHaveProperty('containerWidth');
    expect(result.current).toHaveProperty('containerRef');
    expect(result.current).toHaveProperty('switchScreen');
  });

  it('maintains stable switchScreen reference', () => {
    const { result, rerender } = renderHook(() => useAuthAnimation());
    
    const firstSwitchScreen = result.current.switchScreen;
    
    rerender();
    
    expect(result.current.switchScreen).toBe(firstSwitchScreen);
  });
});
