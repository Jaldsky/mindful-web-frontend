import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageManager, storageManager } from '../../../src/contexts/utils/StorageManager';

describe('LocalStorageManager', () => {
  let manager: LocalStorageManager;

  beforeEach(() => {
    localStorage.clear();
    manager = new LocalStorageManager();
    vi.clearAllMocks();
  });

  describe('getItem', () => {
    it('returns null for non-existent key', () => {
      const result = manager.getItem('non-existent-key');
      expect(result).toBeNull();
    });

    it('returns stored value for existing key', () => {
      localStorage.setItem('test-key', 'test-value');
      const result = manager.getItem('test-key');
      expect(result).toBe('test-value');
    });

    it('returns null and logs warning on error', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = manager.getItem('test-key');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error reading from localStorage (test-key):',
        expect.any(Error)
      );

      getItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('handles empty string value', () => {
      localStorage.setItem('empty-key', '');
      const result = manager.getItem('empty-key');
      expect(result).toBe('');
    });

    it('handles numeric string values', () => {
      localStorage.setItem('number-key', '12345');
      const result = manager.getItem('number-key');
      expect(result).toBe('12345');
    });

    it('handles JSON string values', () => {
      const jsonValue = JSON.stringify({ foo: 'bar' });
      localStorage.setItem('json-key', jsonValue);
      const result = manager.getItem('json-key');
      expect(result).toBe(jsonValue);
    });
  });

  describe('setItem', () => {
    it('stores value in localStorage', () => {
      manager.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');
    });

    it('overwrites existing value', () => {
      localStorage.setItem('test-key', 'old-value');
      manager.setItem('test-key', 'new-value');
      expect(localStorage.getItem('test-key')).toBe('new-value');
    });

    it('logs warning on error', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      manager.setItem('test-key', 'test-value');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error writing to localStorage (test-key):',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('handles empty string value', () => {
      manager.setItem('empty-key', '');
      expect(localStorage.getItem('empty-key')).toBe('');
    });

    it('handles special characters', () => {
      const specialValue = 'test-value-with-special-chars-!@#$%^&*()';
      manager.setItem('special-key', specialValue);
      expect(localStorage.getItem('special-key')).toBe(specialValue);
    });

    it('handles unicode characters', () => {
      const unicodeValue = '测试值 🚀 тест';
      manager.setItem('unicode-key', unicodeValue);
      expect(localStorage.getItem('unicode-key')).toBe(unicodeValue);
    });
  });

  describe('removeItem', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('test-key', 'test-value');
      manager.removeItem('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('does not throw error when removing non-existent key', () => {
      expect(() => manager.removeItem('non-existent-key')).not.toThrow();
    });

    it('logs warning on error', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      manager.removeItem('test-key');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error removing from localStorage (test-key):',
        expect.any(Error)
      );

      removeItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('removes only specified key', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      
      manager.removeItem('key1');
      
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBe('value2');
    });
  });

  describe('clear', () => {
    it('clears all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      manager.clear();

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('key3')).toBeNull();
      expect(localStorage.length).toBe(0);
    });

    it('works when localStorage is already empty', () => {
      expect(() => manager.clear()).not.toThrow();
      expect(localStorage.length).toBe(0);
    });

    it('logs warning on error', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const clearSpy = vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
        throw new Error('Storage error');
      });

      manager.clear();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error clearing localStorage:',
        expect.any(Error)
      );

      clearSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('handles quota exceeded errors on setItem', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      manager.setItem('test-key', 'test-value');

      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('handles private browsing mode errors', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Failed to execute setItem', 'SecurityError');
      });

      manager.setItem('test-key', 'test-value');

      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('integration', () => {
    it('performs multiple operations correctly', () => {
      manager.setItem('key1', 'value1');
      manager.setItem('key2', 'value2');
      
      expect(manager.getItem('key1')).toBe('value1');
      expect(manager.getItem('key2')).toBe('value2');
      
      manager.removeItem('key1');
      
      expect(manager.getItem('key1')).toBeNull();
      expect(manager.getItem('key2')).toBe('value2');
      
      manager.clear();
      
      expect(manager.getItem('key2')).toBeNull();
    });

    it('handles rapid consecutive operations', () => {
      for (let i = 0; i < 100; i++) {
        manager.setItem(`key${i}`, `value${i}`);
      }

      for (let i = 0; i < 100; i++) {
        expect(manager.getItem(`key${i}`)).toBe(`value${i}`);
      }

      manager.clear();
      expect(localStorage.length).toBe(0);
    });
  });
});

describe('storageManager singleton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is an instance of LocalStorageManager', () => {
    expect(storageManager).toBeInstanceOf(LocalStorageManager);
  });

  it('can store and retrieve values', () => {
    storageManager.setItem('test-key', 'test-value');
    expect(storageManager.getItem('test-key')).toBe('test-value');
  });

  it('can remove values', () => {
    storageManager.setItem('test-key', 'test-value');
    storageManager.removeItem('test-key');
    expect(storageManager.getItem('test-key')).toBeNull();
  });

  it('can clear all values', () => {
    storageManager.setItem('key1', 'value1');
    storageManager.setItem('key2', 'value2');
    storageManager.clear();
    expect(storageManager.getItem('key1')).toBeNull();
    expect(storageManager.getItem('key2')).toBeNull();
  });
});
