/**
 * Welcome Page Component
 * First-time user onboarding screen
 */

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { useTranslation } from "../../hooks";
import { extractErrorMessage } from '../../utils';
import { WelcomeModal } from '../../components/modals';
import { ErrorMessage } from '../../components/ui';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { status, createAnonymous, dismissWelcome } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== 'welcome' && status !== 'loading') {
    return <Navigate to="/" replace />;
  }

  if (status === 'loading') {
    return null;
  }

  const handleCreateAnonymous = async () => {
    setLoading(true);
    setError(null);
    try {
      await createAnonymous();
      dismissWelcome();
      navigate('/', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err) || t('common.serverUnavailable'));
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <>
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] max-w-[500px] w-[90%]">
          <ErrorMessage message={error} />
        </div>
      )}
      <WelcomeModal
        isOpen={true}
        onCreateAnonymous={handleCreateAnonymous}
        onRegister={handleSignIn}
        loading={loading}
      />
    </>
  );
};
