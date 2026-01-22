/**
 * Storage Manager
 * Centralized storage operations with error handling
 * Follows Single Responsibility Principle
 */

export interface IStorageManager {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class LocalStorageManager implements IStorageManager {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }
}

export const storageManager = new LocalStorageManager();
