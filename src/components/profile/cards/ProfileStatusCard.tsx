/**
 * Profile Status Card Component
 * Displays user authentication status
 */

import React from 'react';
import { Shield } from 'lucide-react';

interface ProfileStatusCardProps {
  title: string;
  statusLabel: string;
}

export const ProfileStatusCard: React.FC<ProfileStatusCardProps> = ({
  title,
  statusLabel,
}) => {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-semibold flex items-center gap-2"
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          <Shield size={20} style={{ color: 'var(--color-primary)' }} />
          {title}
        </h2>
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-success-text)',
          }}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
};
