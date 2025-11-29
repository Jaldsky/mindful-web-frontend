/**
 * Date Range Selector Component
 * Reusable component for selecting date ranges
 */

import React from 'react';
import { UseDateRangeReturn } from '../hooks/useDateRange';
import { DATE_RANGES } from '../constants';

interface DateRangeSelectorProps {
  dateRange: UseDateRangeReturn['dateRange'];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onQuickSelect: (days: number) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
}) => {
  return (
    <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="flex items-center gap-2">
            <label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              From:
            </label>
            <input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={dateRange.end}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              To:
            </label>
            <input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={dateRange.start}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onQuickSelect(DATE_RANGES.DAYS_7)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            7 days
          </button>
          <button
            onClick={() => onQuickSelect(DATE_RANGES.DAYS_30)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            30 days
          </button>
          <button
            onClick={() => onQuickSelect(DATE_RANGES.DAYS_90)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            90 days
          </button>
        </div>
      </div>
    </div>
  );
};

