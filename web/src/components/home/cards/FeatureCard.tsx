/**
 * Feature Card Component
 * Displays a feature with icon, title and description
 */

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: { bg: string; text: string };
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color 
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--border-radius-md)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--border-radius-md)',
        backgroundColor: color.bg,
        color: color.text,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-primary)',
          marginBottom: '2px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  </div>
);
