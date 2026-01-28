/**
 * Domains Table Component
 * Displays domain usage in a table format with infinite scroll
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Clock, Globe, BarChart3 } from 'lucide-react';
import { DomainUsageStat } from '../../../types';
import { LoadingSpinner } from '../../ui';
import { TableRow } from './TableRow';

interface DomainsTableProps {
  data: DomainUsageStat[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  title?: string;
}

const EMPTY_STATE_COLSPAN = 3;

export const DomainsTable: React.FC<DomainsTableProps> = ({ 
  data, 
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  title = 'Activity Details',
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isEmpty = data.length === 0 && !loading;

  const maxSeconds = useMemo(() => 
    Math.max(...data.map(d => d.total_seconds), 1),
    [data]
  );

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    const element = loadMoreRef.current;
    const container = scrollContainerRef.current;
    if (!element || !container) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: container,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {data.length > 0 && (
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {data.length} {data.length === 1 ? 'domain' : 'domains'}
            </span>
          )}
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700"
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <tr>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Globe size={12} />
                  Domain
                </div>
              </th>
              <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usage
              </th>
              <th className="py-2.5 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-end gap-1.5">
                  <Clock size={12} />
                  Time
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {loading && isEmpty ? (
              <tr>
                <td colSpan={EMPTY_STATE_COLSPAN} className="py-12">
                  <LoadingSpinner size="md" className="justify-center" />
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={EMPTY_STATE_COLSPAN} className="py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Globe size={32} strokeWidth={1.5} />
                    <p className="text-sm">No activity recorded</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.domain} 
                  item={item} 
                  maxSeconds={maxSeconds}
                />
              ))
            )}
          </tbody>
        </table>

        <div ref={loadMoreRef} className="h-1" />
        
        {loadingMore && (
          <div className="py-4 border-t border-gray-100 dark:border-gray-800">
            <LoadingSpinner size="sm" className="justify-center" />
          </div>
        )}
      </div>

      {hasMore && !loadingMore && data.length > 5 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400">Scroll for more</p>
        </div>
      )}
    </div>
  );
};
