import React, { useState } from 'react';
import { HEADER_STYLES } from '../constants';

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  title: string;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  icon,
  label,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentStyle = isHovered
    ? { ...HEADER_STYLES.button.base, ...HEADER_STYLES.button.hover }
    : HEADER_STYLES.button.base;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border rounded font-semibold text-xs transition-all"
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {icon}
      <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </span>
    </button>
  );
};
