/**
 * Section Header Component
 * Header with icon, title and decorative gradient line
 */

import React from 'react';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  color: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, color }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      marginBottom: 'var(--spacing-lg)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 'var(--border-radius-md)',
        backgroundColor: color,
        color: 'white',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <h2
      style={{
        margin: 0,
        fontSize: 'var(--font-size-lg)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        flexShrink: 0,
      }}
    >
      {title}
    </h2>
    <div
      style={{
        flex: 1,
        height: 2,
        marginLeft: 'var(--spacing-md)',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: 1,
      }}
    />
  </div>
);
