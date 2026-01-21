/**
 * Navigation Service
 * Handles page transitions and navigation logic
 * Follows Single Responsibility Principle
 */

export interface INavigationService {
  scheduleNavigation(callback: () => void, delay: number): () => void;
  fadeOutAndNavigate(setVisible: (visible: boolean) => void, navigate: () => void, delay?: number): void;
}

export class NavigationService implements INavigationService {
  scheduleNavigation(callback: () => void, delay: number): () => void {
    const timerId = window.setTimeout(callback, delay);
    return () => window.clearTimeout(timerId);
  }

  fadeOutAndNavigate(
    setVisible: (visible: boolean) => void,
    navigate: () => void,
    delay: number = 300
  ): void {
    setVisible(false);
    setTimeout(navigate, delay);
  }
}

export const navigationService = new NavigationService();
