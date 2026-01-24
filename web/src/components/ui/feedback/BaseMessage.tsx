import React from 'react';
import type { BaseMessageProps } from '../types';
import { MESSAGE_VARIANT_CLASSES, MESSAGE_BASE_CLASSES } from '../constants';

export const BaseMessage: React.FC<BaseMessageProps> = ({ 
  message, 
  variant,
  className = '' 
}) => {
  const classes = [
    MESSAGE_BASE_CLASSES,
    MESSAGE_VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {message}
    </div>
  );
};
