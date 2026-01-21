/**
 * Domains Table Component
 * Displays domain usage in a table format
 */

import React from 'react';
import { DomainUsageStat } from '../../../types';
import { Card } from '../../ui';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface DomainsTableProps {
  data: DomainUsageStat[];
}

const TABLE_COLUMNS = [
  { label: 'Domain', align: 'left' as const },
  { label: 'Category', align: 'left' as const },
  { label: 'Duration', align: 'right' as const },
];

const EMPTY_STATE_COLSPAN = 3;

export const DomainsTable: React.FC<DomainsTableProps> = ({ data }) => {
  const isEmpty = data.length === 0;

  return (
    <Card title="Recent Activity">
      <div className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <TableHeader columns={TABLE_COLUMNS} />
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isEmpty ? (
              <tr>
                <td
                  colSpan={EMPTY_STATE_COLSPAN}
                  className="py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => <TableRow key={item.domain} item={item} />)
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
