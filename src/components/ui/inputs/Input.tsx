import React from 'react';
import type { InputProps } from '../types';

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  const inputClasses = [
    'px-3 py-2 border rounded-lg',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100',
    'border-gray-300 dark:border-gray-600',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-red-500' : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
