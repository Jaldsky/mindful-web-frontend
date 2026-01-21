import { storageManager } from '../utils';
import { STORAGE_KEYS } from '../../constants';

/**
 * Welcome Manager
 * Manages welcome screen state
 * Follows Single Responsibility Principle
 */
export class WelcomeManager {
  isWelcomeShown(): boolean {
    return storageManager.getItem(STORAGE_KEYS.WELCOME_SHOWN) === 'true';
  }

  markWelcomeShown(): void {
    storageManager.setItem(STORAGE_KEYS.WELCOME_SHOWN, 'true');
  }

  shouldShowWelcome(hasAccessToken: boolean, hasAnonToken: boolean): boolean {
    return !hasAccessToken && !hasAnonToken && !this.isWelcomeShown();
  }
}

export const welcomeManager = new WelcomeManager();
