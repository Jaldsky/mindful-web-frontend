/**
 * Table Header Component
 * Renders table headers with consistent styling
 */

import React from 'react';

interface TableHeaderProps {
  columns: Array<{
    label: string;
    align?: 'left' | 'center' | 'right';
  }>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <thead>
      <tr className="border-b border-gray-100 dark:border-gray-800">
        {columns.map((column, index) => (
          <th
            key={index}
            className={`pb-3 font-medium text-gray-500 ${
              column.align === 'right' ? 'text-right' : ''
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
