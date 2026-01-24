/**
 * Date Input Component
 * Styled date input with label
 */

import React, { useMemo } from 'react';
import { Input } from '../../ui';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
}) => {
  const inputId = useMemo(
    () => `date-input-${label.toLowerCase().replace(/\s+/g, '-')}`,
    [label]
  );

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
      >
        {label}:
      </label>
      <Input
        id={inputId}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
      />
    </div>
  );
};
