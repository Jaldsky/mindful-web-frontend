/**
 * Burger Button Component
 * Hamburger menu toggle button
 */

import React from 'react';
import { Menu } from 'lucide-react';

interface BurgerButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const BurgerButton: React.FC<BurgerButtonProps> = ({ onClick, isOpen = false }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--spacing-sm)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--border-radius-md)',
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
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      <Menu size={24} />
    </button>
  );
};
