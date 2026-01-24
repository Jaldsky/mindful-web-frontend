import React, { useState, useLayoutEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts';
import { useTranslation } from '../../../hooks';
import { useTheme } from '../../../contexts';
import { useLocale } from '../../../contexts';
import { HEADER_STYLES } from '../constants';

export const AuthButton: React.FC = () => {
  const { status } = useAuth();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { locale } = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const isAuthenticated = status === 'authenticated';
  
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const prevRectRef = useRef<DOMRect | null>(null);
  const prevLocaleRef = useRef<string>(locale);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    const nextRect = buttonRef.current.getBoundingClientRect();
    const didLocaleChange = prevLocaleRef.current !== locale;
    const prevRect = prevRectRef.current;

    if (!prefersReducedMotion && didLocaleChange && prevRect) {
      const dx = prevRect.left - nextRect.left;
      if (Math.abs(dx) > 0.5) {
        buttonRef.current.animate(
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

    prevRectRef.current = nextRect;
    prevLocaleRef.current = locale;
  }, [locale, prefersReducedMotion]);

  const getStyle = (): React.CSSProperties => {
    if (isAuthenticated) {
      if (isHovered) {
        return { 
          ...HEADER_STYLES.navLink.inactive, 
          backgroundColor: 'var(--color-bg-secondary)',
          color: 'var(--color-primary)',
        };
      }
      return HEADER_STYLES.navLink.inactive;
    }

    const baseStyle = {
      backgroundColor: isDark ? '#388E3C' : 'var(--color-primary)',
      color: isDark ? '#e8f5e9' : 'white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: isDark ? '#388E3C' : 'var(--color-primary)',
      borderRadius: 'var(--border-radius-md)',
      textDecoration: 'none',
      opacity: 1,
    };

    if (isHovered) {
      return {
        ...baseStyle,
        backgroundColor: isDark ? '#4CAF50' : '#388E3C',
        borderColor: isDark ? '#4CAF50' : '#388E3C',
        opacity: 0.95,
      };
    }

    return baseStyle;
  };

  const buttonClassName = "px-3 py-2 rounded text-sm font-medium transition-all whitespace-nowrap flex-shrink-0";
  const buttonStyle: React.CSSProperties = {
    ...getStyle(),
    width: '110px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Link
      ref={buttonRef as React.RefObject<HTMLAnchorElement>}
      to="/auth"
      className={buttonClassName}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ 
        display: 'block',
        textAlign: 'center',
        width: '100%',
        lineHeight: '1.5',
      }}>
        {t('auth.login')}
      </span>

      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: isHovered ? 'translate(0, -50%)' : 'translate(-6px, -50%)',
          opacity: isHovered ? 1 : 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity var(--transition-normal), transform var(--transition-normal)',
          pointerEvents: 'none',
        }}
      >
        <LogIn size={16} />
      </span>
    </Link>
  );
};
