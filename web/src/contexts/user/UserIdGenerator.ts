/**
 * User ID Generator
 * Handles user ID generation
 * Follows Single Responsibility Principle
 */
function fallbackUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] ?? 0) % 16;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export class UserIdGenerator {
  generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return fallbackUUID();
  }
}

export const userIdGenerator = new UserIdGenerator();
