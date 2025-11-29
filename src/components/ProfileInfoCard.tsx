/**
 * Profile Info Card Component
 * Displays a single piece of profile information
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  iconBgColor?: string;
  iconColor?: string;
  copyable?: boolean;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  icon: Icon,
  label,
  value,
  iconBgColor = 'bg-blue-100 dark:bg-blue-900/20',
  iconColor = 'text-blue-600',
  copyable = false,
}) => {
  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-start gap-4">
        <div className={`p-3 ${iconBgColor} rounded-lg ${iconColor} flex-shrink-0`}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold break-all">
              {value || <span className="text-gray-400 italic">Не указано</span>}
            </p>
            {copyable && value && (
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-background-secondary rounded transition-colors"
                title="Копировать"
              >
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

