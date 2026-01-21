import { describe, it, expect } from 'vitest';
import { NAVIGATION_ITEMS, HEADER_STYLES, LAYOUT_STYLES } from '../../../src/components/layout/constants';
import { Home, BarChart3, User } from 'lucide-react';

describe('Layout Constants', () => {
  describe('NAVIGATION_ITEMS', () => {
    it('contains correct number of navigation items', () => {
      expect(NAVIGATION_ITEMS).toHaveLength(3);
    });

    it('contains home navigation item', () => {
      const homeItem = NAVIGATION_ITEMS.find(item => item.path === '/');
      expect(homeItem).toBeDefined();
      expect(homeItem?.labelKey).toBe('navigation.home');
      expect(homeItem?.icon).toBe(Home);
    });

    it('contains dashboard navigation item', () => {
      const dashboardItem = NAVIGATION_ITEMS.find(item => item.path === '/dashboard');
      expect(dashboardItem).toBeDefined();
      expect(dashboardItem?.labelKey).toBe('navigation.dashboard');
      expect(dashboardItem?.icon).toBe(BarChart3);
    });

    it('contains profile navigation item', () => {
      const profileItem = NAVIGATION_ITEMS.find(item => item.path === '/profile');
      expect(profileItem).toBeDefined();
      expect(profileItem?.labelKey).toBe('navigation.profile');
      expect(profileItem?.icon).toBe(User);
    });

    it('all items have required properties', () => {
      NAVIGATION_ITEMS.forEach(item => {
        expect(item).toHaveProperty('path');
        expect(item).toHaveProperty('labelKey');
        expect(item).toHaveProperty('icon');
        expect(typeof item.path).toBe('string');
        expect(typeof item.labelKey).toBe('string');
        expect(item.icon).toBeDefined();
      });
    });
  });

  describe('HEADER_STYLES', () => {
    it('contains container styles', () => {
      expect(HEADER_STYLES.container).toBeDefined();
      expect(HEADER_STYLES.container.backgroundColor).toBe('var(--color-bg-primary)');
      expect(HEADER_STYLES.container.borderColor).toBe('var(--border-color)');
      expect(HEADER_STYLES.container.boxShadow).toBe('var(--shadow-xs)');
    });

    it('contains logo styles', () => {
      expect(HEADER_STYLES.logo).toBeDefined();
      expect(HEADER_STYLES.logo.fontSize).toBe('var(--font-size-xl)');
      expect(HEADER_STYLES.logo.color).toBe('var(--color-primary)');
    });

    it('contains button styles with base and hover states', () => {
      expect(HEADER_STYLES.button).toBeDefined();
      expect(HEADER_STYLES.button.base).toBeDefined();
      expect(HEADER_STYLES.button.hover).toBeDefined();
    });

    it('contains primary button styles', () => {
      expect(HEADER_STYLES.primaryButton).toBeDefined();
      expect(HEADER_STYLES.primaryButton.base.backgroundColor).toBe('var(--color-primary)');
      expect(HEADER_STYLES.primaryButton.base.color).toBe('white');
    });

    it('contains navigation link styles', () => {
      expect(HEADER_STYLES.navLink).toBeDefined();
      expect(HEADER_STYLES.navLink.active).toBeDefined();
      expect(HEADER_STYLES.navLink.inactive).toBeDefined();
    });
  });

  describe('LAYOUT_STYLES', () => {
    it('contains container styles', () => {
      expect(LAYOUT_STYLES.container).toBeDefined();
      expect(LAYOUT_STYLES.container.backgroundColor).toBe('var(--color-bg-overlay)');
      expect(LAYOUT_STYLES.container.fontFamily).toBe('var(--font-family)');
    });

    it('contains main styles', () => {
      expect(LAYOUT_STYLES.main).toBeDefined();
      expect(LAYOUT_STYLES.main.minHeight).toBe('calc(100vh - 4rem)');
    });
  });
});
