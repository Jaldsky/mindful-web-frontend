import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenManager } from '../../../src/contexts/auth/TokenManager';
import { storageManager } from '../../../src/contexts/utils';
import { STORAGE_KEYS } from '../../../src/constants';

vi.mock('../../../src/contexts/utils', () => ({
  storageManager: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('TokenManager', () => {
  let tokenManager: TokenManager;

  beforeEach(() => {
    tokenManager = new TokenManager();
    vi.clearAllMocks();
  });

  describe('Access Tokens', () => {
    it('sets access and refresh tokens', () => {
      tokenManager.setAccessTokens('access-token-123', 'refresh-token-456');

      expect(storageManager.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ACCESS_TOKEN,
        'access-token-123'
      );
      expect(storageManager.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.REFRESH_TOKEN,
        'refresh-token-456'
      );
    });

    it('gets access token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('access-token-123');

      const token = tokenManager.getAccessToken();

      expect(storageManager.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBe('access-token-123');
    });

    it('gets refresh token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('refresh-token-456');

      const token = tokenManager.getRefreshToken();

      expect(storageManager.getItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(token).toBe('refresh-token-456');
    });

    it('clears access tokens', () => {
      tokenManager.clearAccessTokens();

      expect(storageManager.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(storageManager.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
    });

    it('checks if has access token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('access-token-123');
      expect(tokenManager.hasAccessToken()).toBe(true);

      vi.mocked(storageManager.getItem).mockReturnValue(null);
      expect(tokenManager.hasAccessToken()).toBe(false);
    });
  });

  describe('Anonymous Tokens', () => {
    it('sets anonymous tokens', () => {
      tokenManager.setAnonymousTokens('anon-id-123', 'anon-token-456');

      expect(storageManager.setItem).toHaveBeenCalledWith(STORAGE_KEYS.ANON_ID, 'anon-id-123');
      expect(storageManager.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ANON_TOKEN,
        'anon-token-456'
      );
    });

    it('gets anon id', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('anon-id-123');

      const id = tokenManager.getAnonId();

      expect(storageManager.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ANON_ID);
      expect(id).toBe('anon-id-123');
    });

    it('gets anon token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('anon-token-456');

      const token = tokenManager.getAnonToken();

      expect(storageManager.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ANON_TOKEN);
      expect(token).toBe('anon-token-456');
    });

    it('clears anonymous tokens', () => {
      tokenManager.clearAnonymousTokens();

      expect(storageManager.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ANON_ID);
      expect(storageManager.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ANON_TOKEN);
    });

    it('checks if has anon token', () => {
      vi.mocked(storageManager.getItem).mockReturnValue('anon-token-456');
      expect(tokenManager.hasAnonToken()).toBe(true);

      vi.mocked(storageManager.getItem).mockReturnValue(null);
      expect(tokenManager.hasAnonToken()).toBe(false);
    });
  });
});
