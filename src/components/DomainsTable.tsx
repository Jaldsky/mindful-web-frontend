/**
 * Domains Table Component
 * Displays domain usage in a table format
 */

import React from 'react';
import { DomainUsageStat } from '../types/api';
import { formatTime } from '../utils/dateUtils';

interface DomainsTableProps {
  data: DomainUsageStat[];
}

export const DomainsTable: React.FC<DomainsTableProps> = ({ data }) => {
  return (
    <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
      <div className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="pb-3 font-medium text-gray-500">Domain</th>
              <th className="pb-3 font-medium text-gray-500">Category</th>
              <th className="pb-3 font-medium text-gray-500 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={item.domain} 
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 font-medium">{item.domain}</td>
                  <td className="py-3 text-gray-500">{item.category || '-'}</td>
                  <td className="py-3 text-right font-mono">{formatTime(item.total_seconds)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

