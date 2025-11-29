/**
 * Stats Card Component
 * Reusable component for displaying statistics
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  iconBgColor = 'bg-blue-100 dark:bg-blue-900/20',
  iconColor = 'text-blue-600',
}) => {
  return (
    <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${iconBgColor} rounded-lg ${iconColor}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

