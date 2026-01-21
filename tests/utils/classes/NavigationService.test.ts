import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NavigationService } from '../../../src/utils/classes/NavigationService';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    service = new NavigationService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('scheduleNavigation', () => {
    it('should schedule navigation after specified delay', () => {
      const navigate = vi.fn();
      const delay = 1000;

      service.scheduleNavigation(navigate, delay);

      // Navigation should not happen immediately
      expect(navigate).not.toHaveBeenCalled();

      // Fast-forward time
      vi.advanceTimersByTime(delay);

      // Navigation should be called
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('should return cleanup function', () => {
      const navigate = vi.fn();
      const cleanup = service.scheduleNavigation(navigate, 1000);

      expect(typeof cleanup).toBe('function');

      // Cancel navigation before it fires
      cleanup();
      vi.advanceTimersByTime(1000);

      // Navigation should not happen
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should handle multiple scheduled navigations', () => {
      const navigate1 = vi.fn();
      const navigate2 = vi.fn();

      service.scheduleNavigation(navigate1, 500);
      service.scheduleNavigation(navigate2, 1500);

      vi.advanceTimersByTime(500);
      expect(navigate1).toHaveBeenCalledTimes(1);
      expect(navigate2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(navigate2).toHaveBeenCalledTimes(1);
    });

    it('should allow canceling specific navigation', () => {
      const navigate1 = vi.fn();
      const navigate2 = vi.fn();

      const cleanup1 = service.scheduleNavigation(navigate1, 1000);
      service.scheduleNavigation(navigate2, 1000);

      cleanup1();
      vi.advanceTimersByTime(1000);

      expect(navigate1).not.toHaveBeenCalled();
      expect(navigate2).toHaveBeenCalledTimes(1);
    });
  });

  describe('fadeOutAndNavigate', () => {
    it('should call setVisible(false) immediately', () => {
      const setVisible = vi.fn();
      const navigate = vi.fn();

      service.fadeOutAndNavigate(setVisible, navigate);

      expect(setVisible).toHaveBeenCalledWith(false);
      expect(setVisible).toHaveBeenCalledTimes(1);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should call navigate after default delay', () => {
      const setVisible = vi.fn();
      const navigate = vi.fn();

      service.fadeOutAndNavigate(setVisible, navigate);

      // Navigate should not be called immediately
      expect(navigate).not.toHaveBeenCalled();

      // Fast-forward by default delay (300ms)
      vi.advanceTimersByTime(300);

      // Navigate should be called
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('should call navigate after custom delay', () => {
      const setVisible = vi.fn();
      const navigate = vi.fn();
      const customDelay = 500;

      service.fadeOutAndNavigate(setVisible, navigate, customDelay);

      vi.advanceTimersByTime(customDelay - 1);
      expect(navigate).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('should work with zero delay', () => {
      const setVisible = vi.fn();
      const navigate = vi.fn();

      service.fadeOutAndNavigate(setVisible, navigate, 0);

      expect(setVisible).toHaveBeenCalledWith(false);
      expect(navigate).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple fade-out sequences', () => {
      const setVisible1 = vi.fn();
      const navigate1 = vi.fn();
      const setVisible2 = vi.fn();
      const navigate2 = vi.fn();

      service.fadeOutAndNavigate(setVisible1, navigate1, 200);
      service.fadeOutAndNavigate(setVisible2, navigate2, 400);

      expect(setVisible1).toHaveBeenCalledWith(false);
      expect(setVisible2).toHaveBeenCalledWith(false);

      vi.advanceTimersByTime(200);
      expect(navigate1).toHaveBeenCalledTimes(1);
      expect(navigate2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(navigate2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration scenarios', () => {
    it('should support login success navigation flow', () => {
      const setVisible = vi.fn();
      const navigateToDashboard = vi.fn();

      // Simulate successful login with fade-out
      service.fadeOutAndNavigate(setVisible, navigateToDashboard, 300);

      // UI should fade out immediately
      expect(setVisible).toHaveBeenCalledWith(false);

      // Navigation happens after animation
      vi.advanceTimersByTime(300);
      expect(navigateToDashboard).toHaveBeenCalledTimes(1);
    });

    it('should support back button with fade-out', () => {
      const setVisible = vi.fn();
      const goBack = vi.fn();

      service.fadeOutAndNavigate(setVisible, goBack);

      expect(setVisible).toHaveBeenCalledWith(false);
      vi.advanceTimersByTime(300);
      expect(goBack).toHaveBeenCalledTimes(1);
    });

    it('should handle delayed navigation after form submission', () => {
      const navigate = vi.fn();

      // Schedule navigation after showing success message
      const cleanup = service.scheduleNavigation(navigate, 2000);

      // User navigates away manually before auto-navigation
      cleanup();

      vi.advanceTimersByTime(2000);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should coordinate fade-out with scheduled navigation', () => {
      const setVisible = vi.fn();
      const navigate1 = vi.fn();
      const navigate2 = vi.fn();

      // Start fade-out
      service.fadeOutAndNavigate(setVisible, navigate1, 300);

      // Schedule another navigation
      service.scheduleNavigation(navigate2, 1000);

      // First navigation (fade-out)
      vi.advanceTimersByTime(300);
      expect(navigate1).toHaveBeenCalledTimes(1);
      expect(navigate2).not.toHaveBeenCalled();

      // Second navigation (scheduled)
      vi.advanceTimersByTime(700);
      expect(navigate2).toHaveBeenCalledTimes(1);
    });

    it('should work with React Router navigate function', () => {
      const mockNavigate = vi.fn((path: string) => {
        // Simulate React Router navigate
        window.history.pushState({}, '', path);
      });
      const setVisible = vi.fn();

      service.fadeOutAndNavigate(
        setVisible,
        () => mockNavigate('/dashboard')
      );

      vi.advanceTimersByTime(300);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
