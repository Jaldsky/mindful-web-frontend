import React, { useState } from 'react';
import { ModalToggleButtonProps } from '../types';
import { MODAL_STYLES } from '../constants';

export const ModalToggleButton: React.FC<ModalToggleButtonProps> = ({
  icon,
  onClick,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: MODAL_STYLES.TOGGLE_BUTTON.BASE.width,
    height: MODAL_STYLES.TOGGLE_BUTTON.BASE.height,
    background: isHovered
      ? MODAL_STYLES.TOGGLE_BUTTON.HOVER.background
      : 'transparent',
    border: 'none',
    borderRadius: '50%',
    fontSize: MODAL_STYLES.TOGGLE_BUTTON.BASE.fontSize,
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    opacity: isHovered
      ? MODAL_STYLES.TOGGLE_BUTTON.HOVER.opacity
      : MODAL_STYLES.TOGGLE_BUTTON.BASE.opacity,
    transform: isHovered ? `scale(${MODAL_STYLES.TOGGLE_BUTTON.HOVER.scale})` : 'scale(1)',
    boxShadow: isHovered ? MODAL_STYLES.TOGGLE_BUTTON.HOVER.boxShadow : 'none',
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
    >
      {icon}
    </button>
  );
};
