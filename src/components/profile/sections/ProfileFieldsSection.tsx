import React from 'react';
import { ProfileField, TimezoneField } from '../fields';
import { useTranslation } from '../../../hooks';

interface ProfileFieldsSectionProps {
  userId: string | null;
  copiedUserId: boolean;
  onCopyUserId: () => void;
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  editingUsername: boolean;
  editingEmail: boolean;
  usernameInput: string;
  emailInput: string;
  usernameError: string;
  emailError: string;
  onUsernameInputChange: (value: string) => void;
  onEmailInputChange: (value: string) => void;
  onSaveUsername: () => void;
  onCancelUsername: () => void;
  onSaveEmail: () => void;
  onCancelEmail: () => void;
  onStartEditUsername: () => void;
  onStartEditEmail: () => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

export const ProfileFieldsSection: React.FC<ProfileFieldsSectionProps> = ({
  userId,
  copiedUserId,
  onCopyUserId,
  isAuthenticated,
  username,
  email,
  editingUsername,
  editingEmail,
  usernameInput,
  emailInput,
  usernameError,
  emailError,
  onUsernameInputChange,
  onEmailInputChange,
  onSaveUsername,
  onCancelUsername,
  onSaveEmail,
  onCancelEmail,
  onStartEditUsername,
  onStartEditEmail,
  timezone,
  onTimezoneChange,
}) => {
  const { t } = useTranslation();
  const usernameDisplay = username || email?.split('@')[0] || '';

  return (
    <>
      <ProfileField
        label={t('profile.userId')}
        value={userId || ''}
        readOnly
        onCopy={onCopyUserId}
        copied={copiedUserId}
      />

      {editingUsername && isAuthenticated ? (
        <ProfileField
          label={t('profile.username')}
          value=""
          isEditing
          onSave={onSaveUsername}
          onCancel={onCancelUsername}
        >
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => onUsernameInputChange(e.target.value)}
            placeholder={t('auth.usernamePlaceholder')}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '70px',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              transition:
                'border-color var(--transition-normal), background-color var(--transition-normal), color var(--transition-normal)',
              outline: 'none',
              boxShadow: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = 'none';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
              e.target.style.outline = 'none';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onCancelUsername();
              }
            }}
          />
          {usernameError && (
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-danger)',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              {usernameError}
            </div>
          )}
        </ProfileField>
      ) : (
        <ProfileField
          label={t('profile.username')}
          value={usernameDisplay}
          readOnly={!isAuthenticated}
          onEdit={isAuthenticated ? onStartEditUsername : undefined}
        />
      )}

      {editingEmail && isAuthenticated ? (
        <ProfileField
          label={t('profile.email')}
          value=""
          isEditing
          onSave={onSaveEmail}
          onCancel={onCancelEmail}
        >
          <input
            type="email"
            value={emailInput}
            onChange={(e) => onEmailInputChange(e.target.value)}
            placeholder={t('profile.enterEmail')}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '70px',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family)',
              backgroundColor: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              transition:
                'border-color var(--transition-normal), background-color var(--transition-normal), color var(--transition-normal)',
              outline: 'none',
              boxShadow: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = 'none';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
              e.target.style.outline = 'none';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onCancelEmail();
              }
            }}
          />
          {emailError && (
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-danger)',
                marginTop: 'var(--spacing-xs)',
              }}
            >
              {emailError}
            </div>
          )}
        </ProfileField>
      ) : (
        <ProfileField
          label={t('profile.email')}
          value={email || ''}
          readOnly={!isAuthenticated}
          onEdit={isAuthenticated ? onStartEditEmail : undefined}
        />
      )}

      <TimezoneField timezone={timezone} onChange={onTimezoneChange} />
    </>
  );
};
