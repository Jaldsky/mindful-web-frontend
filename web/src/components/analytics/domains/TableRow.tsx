/**
 * Table Row Component
 * Renders a single row in the domains table with favicon and progress bar
 */

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { DomainUsageStat } from '../../../types';
import { formatTime } from '../../../utils';

interface TableRowProps {
  item: DomainUsageStat;
  maxSeconds?: number;
}

const FAVICON_SIZE = 20;

export const TableRow: React.FC<TableRowProps> = ({ item, maxSeconds = 1 }) => {
  const [imgError, setImgError] = useState(false);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`;
  const percentage = Math.min((item.total_seconds / maxSeconds) * 100, 100);
  const visiblePercentage =
    item.total_seconds > 0 ? Math.min(Math.max(percentage, 0.5), 100) : 0;

  return (
    <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {imgError ? (
              <Globe size={16} className="text-gray-400" />
            ) : (
              <img 
                src={faviconUrl}
                alt=""
                width={FAVICON_SIZE}
                height={FAVICON_SIZE}
                className="rounded"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {item.domain}
            </p>
            {item.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {item.category}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 w-32">
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${visiblePercentage}%`,
                background: 'linear-gradient(90deg, #4CAF50, #66BB6A)'
              }}
            />
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300">
          {formatTime(item.total_seconds)}
        </span>
      </td>
    </tr>
  );
};
