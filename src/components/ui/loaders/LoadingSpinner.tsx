import React from 'react';
import type { LoadingSpinnerProps } from '../types';
import { SPINNER_SIZE_CLASSES } from '../constants';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-primary ${SPINNER_SIZE_CLASSES[size]}`} />
    </div>
  );
};
