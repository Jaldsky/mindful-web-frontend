import React from 'react';

interface ProfileCardHeaderProps {
  title: string;
  subtitle?: string;
}

export const ProfileCardHeader: React.FC<ProfileCardHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
      <h1
        style={{
          color: 'var(--color-primary)',
          fontSize: 'clamp(22px, 2.4vw, 32px)',
          fontWeight: 700,
          lineHeight: 1.15,
          margin: 0,
          marginBottom: subtitle ? '8px' : 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
