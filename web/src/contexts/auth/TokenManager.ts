import { storageManager } from '../utils';
import { STORAGE_KEYS } from '../../constants';

/**
 * Token Manager
 * Manages access, refresh and anonymous tokens
 * Follows Single Responsibility Principle
 */
export class TokenManager {
  setAccessTokens(accessToken: string, refreshToken: string): void {
    storageManager.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    storageManager.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  getAccessToken(): string | null {
    return storageManager.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return storageManager.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  clearAccessTokens(): void {
    storageManager.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    storageManager.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }
}

export const tokenManager = new TokenManager();
