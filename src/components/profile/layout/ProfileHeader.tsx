/**
 * Profile Header Component
 * Page header with title and subtitle
 */

import React from 'react';

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1
        className="font-bold mb-2"
        style={{
          fontSize: 'var(--font-size-xl)',
          color: 'var(--color-text-primary)',
        }}
      >
        👤 {title}
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
