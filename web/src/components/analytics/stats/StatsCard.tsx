/**
 * Stats Card Component
 * Reusable component for displaying statistics with modern design
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

type IconVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'teal' | 'sky' | 'indigo';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: IconVariant;
  subtitle?: string;
  loading?: boolean;
}

const VARIANT_STYLES: Record<IconVariant, { 
  iconBg: string; 
  iconText: string;
  accent: string;
  glow: string;
}> = {
  primary: {
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconText: 'text-blue-600 dark:text-blue-400',
    accent: 'from-blue-500/5 to-transparent',
    glow: 'group-hover:shadow-blue-500/10',
  },
  secondary: {
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconText: 'text-purple-600 dark:text-purple-400',
    accent: 'from-purple-500/5 to-transparent',
    glow: 'group-hover:shadow-purple-500/10',
  },
  success: {
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    accent: 'from-emerald-500/5 to-transparent',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  warning: {
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconText: 'text-amber-600 dark:text-amber-400',
    accent: 'from-amber-500/5 to-transparent',
    glow: 'group-hover:shadow-amber-500/10',
  },
  info: {
    iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    iconText: 'text-pink-600 dark:text-pink-400',
    accent: 'from-pink-500/5 to-transparent',
    glow: 'group-hover:shadow-pink-500/10',
  },
  teal: {
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconText: 'text-teal-600 dark:text-teal-400',
    accent: 'from-teal-500/5 to-transparent',
    glow: 'group-hover:shadow-teal-500/10',
  },
  sky: {
    iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
    iconText: 'text-sky-600 dark:text-sky-400',
    accent: 'from-sky-500/5 to-transparent',
    glow: 'group-hover:shadow-sky-500/10',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    accent: 'from-indigo-500/5 to-transparent',
    glow: 'group-hover:shadow-indigo-500/10',
  },
};

const ICON_SIZE = 22;

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  variant = 'primary',
  subtitle,
  loading = false,
}) => {
  const styles = VARIANT_STYLES[variant];
  const isLoading = loading || value === '—';

  return (
    <div 
      className={`
        group relative overflow-hidden
        bg-white dark:bg-gray-900/50
        rounded-xl border border-gray-100 dark:border-gray-800
        p-5 transition-all duration-300
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.accent} pointer-events-none`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 
              className={`
                text-2xl font-bold tracking-tight
                ${isLoading 
                  ? 'text-gray-300 dark:text-gray-600' 
                  : 'text-gray-900 dark:text-white'
                }
                transition-colors duration-200
              `}
            >
              {value}
            </h3>
            {subtitle && !isLoading && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        
        <div 
          className={`
            flex-shrink-0 p-2.5 rounded-xl
            ${styles.iconBg} ${styles.iconText}
          `}
        >
          <Icon size={ICON_SIZE} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};
