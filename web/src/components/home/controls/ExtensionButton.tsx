/**
 * Extension Button Component
 * Browser extension download button with hover effects
 */

import React from 'react';

interface ExtensionButtonProps {
  browser: string;
  icon: React.ReactNode;
  available: boolean;
  href?: string;
}

export const ExtensionButton: React.FC<ExtensionButtonProps> = ({ 
  browser, 
  icon, 
  available, 
  href 
}) => {
  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    backgroundColor: available ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)',
    border: `2px solid ${available ? 'var(--border-color)' : 'transparent'}`,
    borderRadius: 'var(--border-radius-md)',
    cursor: available ? 'pointer' : 'default',
    opacity: available ? 1 : 0.5,
    transition: 'all var(--transition-normal)',
    flex: 1,
    minWidth: 140,
    justifyContent: 'center',
    textDecoration: 'none',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (available) {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (available) {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
    }
  };

  const content = (
    <>
      <span style={{ color: available ? 'var(--color-text-primary)' : 'var(--color-text-light)' }}>
        {icon}
      </span>
      <span
        style={{
          fontWeight: 500,
          fontSize: 'var(--font-size-sm)',
          color: available ? 'var(--color-text-primary)' : 'var(--color-text-light)',
        }}
      >
        {browser}
      </span>
    </>
  );

  if (available && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={!available}
    >
      {content}
    </button>
  );
};
