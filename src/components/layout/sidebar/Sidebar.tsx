/**
 * Sidebar Component
 * Side navigation menu with burger toggle
 */

import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from '../../../hooks';
import { useAuth } from '../../../contexts';
import { NAVIGATION_ITEMS } from '../constants';
import { Logo } from '../header/Logo';
import { AuthButton } from '../header/AuthButton';
import { HeaderControls } from '../header/HeaderControls';
import type { NavigationItem as NavItemType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { status } = useAuth();
  const lastPathRef = useRef<string>(location.pathname);

  // Close sidebar on route change
  useEffect(() => {
    // Always track current path
    const prevPath = lastPathRef.current;
    lastPathRef.current = location.pathname;

    // Close only when the route actually changed AND sidebar is open
    if (isOpen && prevPath !== location.pathname) {
      onClose();
    }
  }, [isOpen, location.pathname, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '280px',
          backgroundColor: 'var(--color-bg-primary)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Logo />
          <button
            onClick={onClose}
            style={{
              padding: 'var(--spacing-xs)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--border-radius-sm)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)',
          }}
        >
          {NAVIGATION_ITEMS.map((item: NavItemType) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-md)',
                  border: 'none',
                  background: isActive
                    ? 'var(--color-bg-secondary)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-md)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer with controls */}
        <div
          style={{
            padding: 'var(--spacing-lg)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            flexShrink: 0,
          }}
        >
          {status !== 'authenticated' && (
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <AuthButton />
            </div>
          )}
          <HeaderControls variant="vertical" />
        </div>
      </aside>
    </>
  );
};
