/**
 * Profile Card Component
 * Reusable card component for displaying profile information
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileCardProps {
  icon: LucideIcon;
  label: string;
  value: string | null | undefined;
  iconBgColor?: string;
  iconColor?: string;
  breakAll?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  icon: Icon,
  label,
  value,
  iconBgColor,
  iconColor,
  breakAll = false,
}) => {
  return (
    <div className="section-card">
      <div className="flex items-center gap-3">
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: iconBgColor,
            color: iconColor,
          }}
        >
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <p
            className="text-xs mb-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </p>
          <p
            className={`font-semibold ${breakAll ? 'break-all' : ''}`}
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-md)',
            }}
          >
            {value || '—'}
          </p>
        </div>
      </div>
    </div>
  );
};
