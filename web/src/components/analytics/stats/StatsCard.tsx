/**
 * Stats Card Component
 * Reusable component for displaying statistics
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

type IconVariant = 'primary' | 'secondary' | 'success' | 'warning';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: IconVariant;
}

const ICON_STYLES: Record<IconVariant, { bg: string; text: string }> = {
  primary: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  secondary: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
  },
};

const ICON_SIZE = 24;

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  variant = 'primary',
}) => {
  const iconStyle = ICON_STYLES[variant];

  return (
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${iconStyle.bg} ${iconStyle.text}`}>
        <Icon size={ICON_SIZE} />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </h3>
      </div>
    </div>
  );
};
