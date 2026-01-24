/**
 * Profile Page Component
 * Modern, clean design with improved spatial organization
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout';
import { useUser, useAuth } from '../../contexts';
import {
  useTranslation,
  useTimezone,
  useProfileData,
  useProfileEditing,
  useProfileTimezone,
  useProfileCopy,
  useProfileLogout,
  useProfileEntranceAnimation,
  useProfileErrorState,
} from '../../hooks';
import { Card } from '../../components/ui';
import {
  ProfileCardHeader,
  ProfileErrorBanner,
  ProfileFieldsSection,
  ProfileLogoutSection,
} from '../../components/profile';

export const Profile: React.FC = () => {
  const { userId } = useUser();
  const { status, user: authUser, updateUsername, logout } = useAuth();
  const { t } = useTranslation();
  const { timezone: detectedTimezone } = useTimezone();
  const navigate = useNavigate();
  const isAuthenticated = status === 'authenticated';
  const { email, setEmail, username, setUsername, timezone, setTimezone } =
    useProfileData({
      isAuthenticated,
      authUser,
      detectedTimezone,
    });
  const { serverError, isErrorVisible, setServerError, hideError } =
    useProfileErrorState();
  const {
    editingEmail,
    editingUsername,
    emailInput,
    setEmailInput,
    usernameInput,
    setUsernameInput,
    emailError,
    usernameError,
    startEditUsername,
    startEditEmail,
    handleSaveEmail,
    handleCancelEmail,
    handleSaveUsername,
    handleCancelUsername,
  } = useProfileEditing({
    isAuthenticated,
    email,
    setEmail,
    username,
    setUsername,
    updateUsername,
    t,
    setServerError,
  });
  const { handleTimezoneChange } = useProfileTimezone({ setTimezone });
  const { copiedUserId, handleCopyUserId } = useProfileCopy({ userId });
  const { isLoggingOut, isLogoutHovered, setIsLogoutHovered, handleLogout } =
    useProfileLogout({ logout, navigate });
  const { isVisible, containerRef } = useProfileEntranceAnimation();

  return (
    <Layout>
      <div className="mx-auto" style={{ maxWidth: '420px' }}>
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <Card noPadding className="overflow-hidden" style={{ position: 'relative' }}>
            <ProfileErrorBanner
              message={serverError}
              isVisible={isErrorVisible}
              onClose={hideError}
            />
            <div ref={containerRef} style={{ padding: 'var(--spacing-xxl)' }}>
              <ProfileCardHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />
              <ProfileFieldsSection
                userId={userId}
                copiedUserId={copiedUserId}
                onCopyUserId={handleCopyUserId}
                isAuthenticated={isAuthenticated}
                username={username}
                email={email}
                editingUsername={editingUsername}
                editingEmail={editingEmail}
                usernameInput={usernameInput}
                emailInput={emailInput}
                usernameError={usernameError}
                emailError={emailError}
                onUsernameInputChange={setUsernameInput}
                onEmailInputChange={setEmailInput}
                onSaveUsername={handleSaveUsername}
                onCancelUsername={handleCancelUsername}
                onSaveEmail={handleSaveEmail}
                onCancelEmail={handleCancelEmail}
                onStartEditUsername={startEditUsername}
                onStartEditEmail={startEditEmail}
                timezone={timezone}
                onTimezoneChange={handleTimezoneChange}
              />
              <ProfileLogoutSection
                isAuthenticated={isAuthenticated}
                isLoggingOut={isLoggingOut}
                isLogoutHovered={isLogoutHovered}
                onLogout={handleLogout}
                onHoverChange={setIsLogoutHovered}
              />
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
