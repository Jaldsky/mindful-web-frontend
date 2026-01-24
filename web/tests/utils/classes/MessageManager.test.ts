import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MessageManager } from '../../../src/utils/classes/MessageManager';

describe('MessageManager', () => {
  let manager: MessageManager;

  beforeEach(() => {
    manager = new MessageManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('scheduleHide', () => {
    it('should schedule callback to run after specified delay', () => {
      const callback = vi.fn();
      const delay = 3000;

      manager.scheduleHide(callback, delay);

      // Callback should not be called immediately
      expect(callback).not.toHaveBeenCalled();

      // Fast-forward time by delay
      vi.advanceTimersByTime(delay);

      // Callback should be called
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return cleanup function', () => {
      const callback = vi.fn();
      const cleanup = manager.scheduleHide(callback, 1000);

      expect(typeof cleanup).toBe('function');

      // Call cleanup before timer fires
      cleanup();
      vi.advanceTimersByTime(1000);

      // Callback should not be called
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple scheduled callbacks independently', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      manager.scheduleHide(callback1, 1000);
      manager.scheduleHide(callback2, 2000);

      // Fast-forward by 1000ms
      vi.advanceTimersByTime(1000);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      // Fast-forward by another 1000ms
      vi.advanceTimersByTime(1000);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should allow canceling specific timer via cleanup function', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const cleanup1 = manager.scheduleHide(callback1, 1000);
      manager.scheduleHide(callback2, 1000);

      // Cancel first timer
      cleanup1();

      // Fast-forward
      vi.advanceTimersByTime(1000);

      // Only second callback should be called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearTimer', () => {
    it('should clear timer by id', () => {
      const callback = vi.fn();
      const timerId = window.setTimeout(callback, 1000);

      manager.clearTimer(timerId);
      vi.advanceTimersByTime(1000);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle null timer id gracefully', () => {
      expect(() => {
        manager.clearTimer(null);
      }).not.toThrow();
    });

    it('should handle clearing already cleared timer', () => {
      const callback = vi.fn();
      const timerId = window.setTimeout(callback, 1000);

      manager.clearTimer(timerId);
      manager.clearTimer(timerId); // Clear again

      vi.advanceTimersByTime(1000);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not affect other timers when clearing one', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const timerId1 = window.setTimeout(callback1, 1000);
      window.setTimeout(callback2, 1000);

      manager.clearTimer(timerId1);
      vi.advanceTimersByTime(1000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration scenarios', () => {
    it('should support typical message auto-hide use case', () => {
      const hideMessage = vi.fn();

      // Schedule message to hide after 3 seconds
      const cleanup = manager.scheduleHide(hideMessage, 3000);

      // Message should still be visible
      expect(hideMessage).not.toHaveBeenCalled();

      // User dismisses message manually before auto-hide
      cleanup();

      // Time passes
      vi.advanceTimersByTime(3000);

      // Auto-hide should not trigger
      expect(hideMessage).not.toHaveBeenCalled();
    });

    it('should handle rapid schedule/cancel cycles', () => {
      const callback = vi.fn();

      // Rapidly schedule and cancel
      for (let i = 0; i < 10; i++) {
        const cleanup = manager.scheduleHide(callback, 1000);
        cleanup();
      }

      // Finally schedule one that stays
      manager.scheduleHide(callback, 1000);

      vi.advanceTimersByTime(1000);

      // Only the last one should execute
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should work with different delay values', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      manager.scheduleHide(callback1, 500);
      manager.scheduleHide(callback2, 1500);
      manager.scheduleHide(callback3, 3000);

      vi.advanceTimersByTime(500);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1500);
      expect(callback3).toHaveBeenCalledTimes(1);
    });
  });
});
