/**
 * Profile Anonymous Card Component
 * Card for anonymous users with sign-in prompt
 */

import React from 'react';
import { Hash } from 'lucide-react';

interface ProfileAnonymousCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onSignInClick: () => void;
}

export const ProfileAnonymousCard: React.FC<ProfileAnonymousCardProps> = ({
  title,
  description,
  buttonLabel,
  onSignInClick,
}) => {
  return (
    <div className="section-card text-center">
      <div className="mb-4">
        <Hash
          size={48}
          className="mx-auto mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        />
        <h3
          className="font-semibold mb-2"
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {description}
        </p>
      </div>
      <button
        onClick={onSignInClick}
        className="btn-base btn-login mx-auto"
        style={{ height: '44px', minWidth: '200px' }}
      >
        {buttonLabel}
      </button>
    </div>
  );
};
