import React, { useState } from 'react';
import { HEADER_STYLES } from '../constants';

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
  variant?: 'compact' | 'default';
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  icon,
  label,
  title,
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentStyle = isHovered
    ? { ...HEADER_STYLES.button.base, ...HEADER_STYLES.button.hover }
    : HEADER_STYLES.button.base;

  const isCompact = variant === 'compact';

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 border rounded font-semibold text-xs transition-all whitespace-nowrap flex-shrink-0"
      style={{
        ...currentStyle,
        minWidth: isCompact ? '40px' : '70px',
        width: isCompact ? '40px' : 'auto',
        height: isCompact ? '40px' : 'auto',
        padding: isCompact ? '0' : '6px 10px',
        borderRadius: isCompact ? '10px' : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      aria-label={title}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      {!isCompact ? (
        <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
          {label}
        </span>
      ) : null}
    </button>
  );
};
