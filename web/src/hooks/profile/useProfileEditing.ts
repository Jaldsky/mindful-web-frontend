import { Dispatch, SetStateAction } from 'react';
import { useEmailEditing } from './useEmailEditing';
import { useEmailVerification } from './useEmailVerification';
import { useUsernameEditing } from './useUsernameEditing';

interface UseProfileEditingParams {
  isAuthenticated: boolean;
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  updateUsername: (username: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  reloadProfile: () => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  setServerError: (error: string | null) => void;
}

export const useProfileEditing = ({
  isAuthenticated,
  email,
  setEmail,
  username,
  setUsername,
  updateUsername,
  updateEmail,
  verifyEmail,
  resendCode,
  reloadProfile,
  t,
  setServerError,
}: UseProfileEditingParams) => {
  const verification = useEmailVerification({
    verifyEmail,
    resendCode,
    reloadProfile,
    setEmail,
    t,
  });

  const emailEditing = useEmailEditing({
    isAuthenticated,
    email,
    setEmail,
    updateEmail,
    t,
    setServerError,
    onVerificationNeeded: (pendingEmail: string) => {
      verification.openVerification(pendingEmail, t('profile.verifyEmailInfo'));
    },
  });

  const usernameEditing = useUsernameEditing({
    isAuthenticated,
    email,
    username,
    setUsername,
    updateUsername,
    t,
    setServerError,
  });

  return {
    ...emailEditing,
    ...usernameEditing,
    ...verification,
  };
};
