import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { extractErrorMessage } from '../../utils';

interface UseUsernameEditingParams {
  isAuthenticated: boolean;
  email: string | null;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  updateUsername: (username: string) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  setServerError: (error: string | null) => void;
}

export const useUsernameEditing = ({
  isAuthenticated,
  email,
  username,
  setUsername,
  updateUsername,
  t,
  setServerError,
}: UseUsernameEditingParams) => {
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const lastUsernameRequestAtRef = useRef<number | null>(null);
  const USERNAME_CHANGE_COOLDOWN_MS = 30000;

  const startEditUsername = () => {
    if (!isAuthenticated) return;
    setUsernameInput(username || email?.split('@')[0] || '');
    setEditingUsername(true);
    setUsernameError('');
  };

  const handleSaveUsername = async () => {
    if (!usernameInput) {
      setUsernameError(t('auth.errors.usernameRequired'));
      return;
    }
    if (usernameInput.length < 3) {
      setUsernameError(t('auth.errors.usernameTooShort'));
      return;
    }
    if (usernameInput.length > 20) {
      setUsernameError(t('auth.errors.usernameTooLong'));
      return;
    }

    if (isUpdatingUsername) {
      setUsernameError(t('profile.usernameChangeInProgress'));
      return;
    }

    if (lastUsernameRequestAtRef.current) {
      const elapsedMs = Date.now() - lastUsernameRequestAtRef.current;
      if (elapsedMs < USERNAME_CHANGE_COOLDOWN_MS) {
        const secondsLeft = Math.ceil((USERNAME_CHANGE_COOLDOWN_MS - elapsedMs) / 1000);
        setUsernameError(t('profile.usernameChangeCooldown', { seconds: secondsLeft }));
        return;
      }
    }

    setIsUpdatingUsername(true);
    try {
      await updateUsername(usernameInput);
      lastUsernameRequestAtRef.current = Date.now();
      setUsername(usernameInput);
      setEditingUsername(false);
      setUsernameError('');
    } catch (error: unknown) {
      setServerError(extractErrorMessage(error) || t('auth.genericError'));
      setUsernameError('');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleCancelUsername = () => {
    setUsernameInput(username || '');
    setEditingUsername(false);
    setUsernameError('');
    setServerError(null);
  };

  return {
    editingUsername,
    usernameInput,
    setUsernameInput,
    usernameError,
    startEditUsername,
    handleSaveUsername,
    handleCancelUsername,
  };
};
