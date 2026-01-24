import React from 'react';
import type { CardProps } from '../types';

export const Card: React.FC<CardProps> = ({
  title,
  noPadding = false,
  className = '',
  children,
  ...props
}) => {
  const cardClasses = [
    'bg-background-primary rounded-xl shadow-sm border border-gray-100 dark:border-gray-800',
    noPadding ? '' : 'p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} {...props}>
      {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
};
