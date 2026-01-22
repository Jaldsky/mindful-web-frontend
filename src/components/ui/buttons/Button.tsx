import React from 'react';
import type { ButtonProps } from '../types';
import { BUTTON_VARIANT_CLASSES, BUTTON_SIZE_CLASSES, BUTTON_BASE_CLASSES } from '../constants';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const classes = [
    BUTTON_BASE_CLASSES,
    'button-animated', // Add animation class
    BUTTON_VARIANT_CLASSES[variant],
    BUTTON_SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
