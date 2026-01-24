/**
 * Empty State Component
 * Displays message when no data is available
 */

import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg border border-blue-100 dark:border-blue-800 ${className}`}>
      {message}
    </div>
  );
};

