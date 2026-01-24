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

  it('switchScreen does not change if transitioning', async () => {
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
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    // Assign container
    result.current.containerRef.current = mockContainer;
    
    // Start transition to register
    act(() => {
      result.current.switchScreen('register');
    });
    
    // Wait for transition to start and isTransitioning to become true
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Verify we're transitioning
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.activeScreen).toBe('register');
    
    // Try to switch again while transitioning - should be ignored
    act(() => {
      result.current.switchScreen('login');
    });
    
    // Screen should still be 'register' because we're transitioning
    expect(result.current.activeScreen).toBe('register');
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

  it('handles screen transition with container', async () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    // Create a mock container with form
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    Object.defineProperty(mockContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    result.current.containerRef.current = mockContainer;
    
    act(() => {
      result.current.switchScreen('register');
    });
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(result.current.activeScreen).toBe('register');
    expect(result.current.displayScreen).toBe('register');
  });

  it('handles transition end event', async () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    Object.defineProperty(mockContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    result.current.containerRef.current = mockContainer;
    
    act(() => {
      result.current.switchScreen('register');
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Simulate transition end
    const transitionEndEvent = new Event('transitionend', { bubbles: true });
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'height' });
    mockContainer.dispatchEvent(transitionEndEvent);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(result.current.isTransitioning).toBe(false);
  });

  it('handles retry when dimensions are invalid', async () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    // Initially return 0 for height
    let heightValue = 0;
    Object.defineProperty(mockContainer, 'scrollHeight', {
      get: () => heightValue,
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    result.current.containerRef.current = mockContainer;
    
    act(() => {
      result.current.switchScreen('register');
    });
    
    // Wait a bit, then set valid height
    await new Promise(resolve => setTimeout(resolve, 60));
    heightValue = 500;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(result.current.activeScreen).toBe('register');
  });

  it('sets body overflow hidden during transition', async () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    Object.defineProperty(mockContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    result.current.containerRef.current = mockContainer;
    
    act(() => {
      result.current.switchScreen('register');
    });
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Body should have overflow hidden
    expect(document.body.style.overflow).toBe('hidden');
    
    // Simulate transition end to clean up
    const transitionEndEvent = new Event('transitionend', { bubbles: true });
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'height' });
    mockContainer.dispatchEvent(transitionEndEvent);
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Body overflow should be reset
    expect(document.body.style.overflow).toBe('');
  });

  it('handles all screen transitions', async () => {
    const { result } = renderHook(() => useAuthAnimation('login'));
    
    const mockContainer = document.createElement('div');
    const mockForm = document.createElement('div');
    mockForm.className = 'auth-form';
    mockContainer.appendChild(mockForm);
    
    Object.defineProperty(mockContainer, 'scrollHeight', {
      value: 500,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(mockContainer, 'offsetWidth', {
      value: 400,
      writable: true,
      configurable: true,
    });
    
    result.current.containerRef.current = mockContainer;
    
    // Test single transition to register
    act(() => {
      result.current.switchScreen('register');
    });
    
    // Wait for async operations and transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate transition end to complete the transition
    const transitionEndEvent = new Event('transitionend', { bubbles: true });
    Object.defineProperty(transitionEndEvent, 'propertyName', { value: 'height' });
    mockContainer.dispatchEvent(transitionEndEvent);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(result.current.activeScreen).toBe('register');
    expect(result.current.displayScreen).toBe('register');
  });
});
