/**
 * Date Range Selector Component
 * Compact, modern date range selector
 */

import React, { useMemo, useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { UseDateRangeReturn } from "../../../hooks";
import { QUICK_RANGES } from '../../../constants';

interface DateRangeSelectorProps {
  dateRange: UseDateRangeReturn['dateRange'];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onQuickSelect: (days: number) => void;
}

const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const maxEndDate = useMemo(
    () => new Date().toISOString().split('T')[0],
    []
  );

  const displayRange = `${formatDisplayDate(dateRange.start)} — ${formatDisplayDate(dateRange.end)}`;

  return (
    <div className="flex items-center gap-2">
      {/* Quick range buttons */}
      <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {QUICK_RANGES.map((range) => (
          <button
            key={range.days}
            onClick={() => onQuickSelect(range.days)}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 
              hover:text-gray-900 dark:hover:text-white
              hover:bg-white dark:hover:bg-gray-700
              rounded-md transition-all duration-200"
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg text-sm
            hover:border-gray-300 dark:hover:border-gray-600
            transition-colors duration-200"
        >
          <Calendar size={14} className="text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {displayRange}
          </span>
          <ChevronDown 
            size={14} 
            className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsExpanded(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-20 
              bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-xl shadow-lg p-4 min-w-[280px]"
            >
              <div className="space-y-4">
                <div className="sm:hidden flex flex-wrap gap-1">
                  {QUICK_RANGES.map((range) => (
                    <button
                      key={range.days}
                      onClick={() => {
                        onQuickSelect(range.days);
                        setIsExpanded(false);
                      }}
                      className="px-3 py-1.5 text-xs font-medium 
                        bg-gray-100 dark:bg-gray-700 
                        text-gray-600 dark:text-gray-400 
                        hover:bg-gray-200 dark:hover:bg-gray-600
                        rounded-md transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => onStartDateChange(e.target.value)}
                      max={dateRange.end}
                      className="w-full px-3 py-2 text-sm
                        bg-gray-50 dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-700 
                        rounded-lg
                        text-gray-700 dark:text-gray-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => onEndDateChange(e.target.value)}
                      min={dateRange.start}
                      max={maxEndDate}
                      className="w-full px-3 py-2 text-sm
                        bg-gray-50 dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-700 
                        rounded-lg
                        text-gray-700 dark:text-gray-300
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-full py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
