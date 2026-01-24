/**
 * Profile Logout Button Component
 * Logout button with hover effects
 */

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

interface ProfileLogoutButtonProps {
  label: string;
  onClick: () => void;
}

export const ProfileLogoutButton: React.FC<ProfileLogoutButtonProps> = ({
  label,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="section-card">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 btn-base"
        style={{
          height: '44px',
          color: 'var(--color-danger)',
          borderColor: 'var(--color-danger)',
          backgroundColor: isHovered
            ? 'rgba(244, 67, 54, 0.12)'
            : 'var(--color-bg-secondary)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LogOut size={20} />
        {label}
      </button>
    </div>
  );
};
