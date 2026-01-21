/**
 * Table Row Component
 * Renders a single row in the domains table
 */

import React from 'react';
import { DomainUsageStat } from '../../../types';
import { formatTime } from '../../../utils';
import { TABLE_CONFIG } from '../../../constants';

interface TableRowProps {
  item: DomainUsageStat;
}

export const TableRow: React.FC<TableRowProps> = ({ item }) => {
  return (
    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className={TABLE_CONFIG.CELL_CLASSES.DOMAIN}>{item.domain}</td>
      <td className={TABLE_CONFIG.CELL_CLASSES.CATEGORY}>
        {item.category || TABLE_CONFIG.EMPTY_CELL_PLACEHOLDER}
      </td>
      <td className={TABLE_CONFIG.CELL_CLASSES.DURATION}>
        {formatTime(item.total_seconds)}
      </td>
    </tr>
  );
};
