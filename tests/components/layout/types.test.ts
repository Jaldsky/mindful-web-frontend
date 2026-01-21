import { describe, it, expect } from 'vitest';
import type { NavigationItem, LayoutProps, HeaderProps } from '../../../src/components/layout/types';
import { Home } from 'lucide-react';

describe('Layout Types', () => {
  describe('NavigationItem', () => {
    it('accepts valid navigation item', () => {
      const validItem: NavigationItem = {
        path: '/',
        labelKey: 'navigation.home',
        icon: Home,
      };

      expect(validItem.path).toBe('/');
      expect(validItem.labelKey).toBe('navigation.home');
      expect(validItem.icon).toBe(Home);
    });
  });

  describe('LayoutProps', () => {
    it('accepts valid layout props', () => {
      const validProps: LayoutProps = {
        children: 'test content',
      };

      expect(validProps.children).toBe('test content');
    });

    it('accepts React elements as children', () => {
      const element = { type: 'div', props: {} };
      const validProps: LayoutProps = {
        children: element as React.ReactNode,
      };

      expect(validProps.children).toBeDefined();
    });
  });

  describe('HeaderProps', () => {
    it('accepts header props with optional children', () => {
      const validProps: HeaderProps = {
        children: 'header content',
      };

      expect(validProps.children).toBe('header content');
    });

    it('accepts header props without children', () => {
      const validProps: HeaderProps = {};

      expect(validProps.children).toBeUndefined();
    });
  });
});
