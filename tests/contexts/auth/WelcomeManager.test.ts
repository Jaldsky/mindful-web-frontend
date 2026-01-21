import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WelcomeManager } from '../../../src/contexts/auth/WelcomeManager';
import { storageManager } from '../../../src/contexts/utils';
import { STORAGE_KEYS } from '../../../src/constants';

vi.mock('../../../src/contexts/utils', () => ({
  storageManager: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe('WelcomeManager', () => {
  let welcomeManager: WelcomeManager;

  beforeEach(() => {
    welcomeManager = new WelcomeManager();
    vi.clearAllMocks();
  });

  describe('isWelcomeShown', () => {
    it('returns true when welcome was shown', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('true');

      const result = welcomeManager.isWelcomeShown();

      expect(storageManager.getItem).toHaveBeenCalledWith(STORAGE_KEYS.WELCOME_SHOWN);
      expect(result).toBe(true);
    });

    it('returns false when welcome was not shown', () => {
      vi.mocked(storageManager.getItem).mockReturnValue(null);

      const result = welcomeManager.isWelcomeShown();

      expect(result).toBe(false);
    });

    it('returns false when welcome value is not "true"', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('false');

      const result = welcomeManager.isWelcomeShown();

      expect(result).toBe(false);
    });
  });

  describe('markWelcomeShown', () => {
    it('marks welcome as shown', () => {
      welcomeManager.markWelcomeShown();

      expect(storageManager.setItem).toHaveBeenCalledWith(STORAGE_KEYS.WELCOME_SHOWN, 'true');
    });
  });

  describe('shouldShowWelcome', () => {
    it('returns true when no tokens and welcome not shown', () => {
      vi.mocked(storageManager.getItem).mockReturnValue(null);

      const result = welcomeManager.shouldShowWelcome(false, false);

      expect(result).toBe(true);
    });

    it('returns false when has access token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue(null);

      const result = welcomeManager.shouldShowWelcome(true, false);

      expect(result).toBe(false);
    });

    it('returns false when has anon token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue(null);

      const result = welcomeManager.shouldShowWelcome(false, true);

      expect(result).toBe(false);
    });

    it('returns false when welcome already shown', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('true');

      const result = welcomeManager.shouldShowWelcome(false, false);

      expect(result).toBe(false);
    });

    it('returns false when has both tokens', () => {
      vi.mocked(storageManager.getItem).mockReturnValue(null);

      const result = welcomeManager.shouldShowWelcome(true, true);

      expect(result).toBe(false);
    });
  });
});
