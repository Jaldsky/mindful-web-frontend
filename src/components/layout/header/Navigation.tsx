import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocale } from '../../../contexts';
import { NAVIGATION_ITEMS } from '../constants';
import { NavigationItem } from './NavigationItem';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { locale } = useLocale();

  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const prevRectsRef = useRef<Map<string, DOMRect> | null>(null);
  const prevLocaleRef = useRef<string>(locale);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  useLayoutEffect(() => {
    const nodes = Array.from(itemRefs.current.entries());
    if (nodes.length === 0) return;

    const nextRects = new Map<string, DOMRect>();
    for (const [key, el] of nodes) {
      nextRects.set(key, el.getBoundingClientRect());
    }

    const didLocaleChange = prevLocaleRef.current !== locale;
    const prevRects = prevRectsRef.current;

    if (!prefersReducedMotion && didLocaleChange && prevRects) {
      for (const [key, el] of nodes) {
        const prev = prevRects.get(key);
        const next = nextRects.get(key);
        if (!prev || !next) continue;

        const dx = prev.left - next.left;
        if (Math.abs(dx) < 0.5) continue;

        el.animate(
          [
            { transform: `translateX(${dx}px)`, opacity: 0.9 },
            { transform: 'translateX(0)', opacity: 1 },
          ],
          {
            duration: 260,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }
        );
      }
    }

    prevRectsRef.current = nextRects;
    prevLocaleRef.current = locale;
  }, [locale, prefersReducedMotion]);

  return (
    <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
      {NAVIGATION_ITEMS.map((item) => (
        <div
          key={item.path}
          ref={(el) => {
            if (!el) {
              itemRefs.current.delete(item.path);
              return;
            }
            itemRefs.current.set(item.path, el);
          }}
          style={{ display: 'inline-flex' }}
        >
          <NavigationItem
            item={item}
            isActive={location.pathname === item.path}
          />
        </div>
      ))}
    </nav>
  );
};
