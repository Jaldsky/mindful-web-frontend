import React from 'react';
import { Button } from '../../ui';
import { LogOut } from 'lucide-react';
import { useTranslation } from '../../../hooks';

interface ProfileLogoutSectionProps {
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isLogoutHovered: boolean;
  onLogout: () => void;
  onHoverChange: (value: boolean) => void;
}

export const ProfileLogoutSection: React.FC<ProfileLogoutSectionProps> = ({
  isAuthenticated,
  isLoggingOut,
  isLogoutHovered,
  onLogout,
  onHoverChange,
}) => {
  const { t } = useTranslation();

  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        marginTop: 'var(--spacing-lg)',
        paddingTop: 'var(--spacing-lg)',
        borderTop: '1px solid var(--border-color)',
      }}
    >
      <Button
        variant="outline"
        onClick={onLogout}
        disabled={isLoggingOut}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '44px',
          color: 'var(--color-danger)',
          backgroundColor: isLogoutHovered
            ? 'rgba(244, 67, 54, 0.12)'
            : 'var(--color-bg-secondary)',
          borderColor: 'var(--color-danger)',
          opacity: isLoggingOut ? 0.6 : 1,
          cursor: isLoggingOut ? 'wait' : 'pointer',
          position: 'relative',
        }}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isLogoutHovered ? '1.3em' : '0',
            height: '1.3em',
            marginRight: isLogoutHovered ? '6px' : '0',
            opacity: isLogoutHovered ? 1 : 0,
            overflow: 'hidden',
            transition:
              'width var(--transition-normal), margin-right var(--transition-normal), opacity var(--transition-normal)',
          }}
        >
          <LogOut size={16} />
        </span>
        <span>{isLoggingOut ? t('auth.loggingOut') : t('auth.logout')}</span>
      </Button>
    </div>
  );
};
