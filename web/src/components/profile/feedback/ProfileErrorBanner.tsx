import React from 'react';

interface ProfileErrorBannerProps {
  message: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ProfileErrorBanner: React.FC<ProfileErrorBannerProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '70px',
        left: 'var(--spacing-xxl)',
        right: 'var(--spacing-xxl)',
        backgroundColor: 'var(--color-error)',
        color: 'var(--color-error-text)',
        border: '1px solid var(--color-error-border)',
        fontSize: 'var(--font-size-sm)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-sm)',
        animation: isVisible ? 'slideDownError 0.3s ease' : 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 10,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <span style={{ flex: 1, textAlign: 'center' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-error-text)',
          cursor: 'pointer',
          fontSize: '20px',
          padding: '0',
          lineHeight: '1',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};
