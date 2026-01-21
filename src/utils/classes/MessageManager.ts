/**
 * Message Manager
 * Handles auto-hiding messages with timers
 * Follows Single Responsibility Principle
 */

export interface IMessageManager {
  scheduleHide(callback: () => void, delay: number): () => void;
  clearTimer(timerId: number | null): void;
}

export class MessageManager implements IMessageManager {
  scheduleHide(callback: () => void, delay: number): () => void {
    const timerId = window.setTimeout(callback, delay);
    return () => window.clearTimeout(timerId);
  }

  clearTimer(timerId: number | null): void {
    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
  }
}

export const messageManager = new MessageManager();
