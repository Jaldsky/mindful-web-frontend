/**
 * Date Range Selector Component
 * Reusable component for selecting date ranges
 */

import React, { useMemo } from 'react';
import { UseDateRangeReturn } from '../../../hooks/useDateRange';
import { QUICK_RANGES } from '../../../constants';
import { Card } from '../../ui';
import { DateInput } from './DateInput';
import { QuickRangeButton } from './QuickRangeButton';

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
  const maxEndDate = useMemo(
    () => new Date().toISOString().split('T')[0],
    []
  );

  return (
    <Card noPadding className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <DateInput
            label="From"
            value={dateRange.start}
            onChange={onStartDateChange}
            max={dateRange.end}
          />

          <DateInput
            label="To"
            value={dateRange.end}
            onChange={onEndDateChange}
            min={dateRange.start}
            max={maxEndDate}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {QUICK_RANGES.map((range) => (
            <QuickRangeButton
              key={range.days}
              label={range.label}
              onClick={() => onQuickSelect(range.days)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
