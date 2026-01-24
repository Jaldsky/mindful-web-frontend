import { Dispatch, SetStateAction, useState } from 'react';

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
    try {
      await updateUsername(usernameInput);
      setUsername(usernameInput);
      setEditingUsername(false);
      setUsernameError('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('auth.genericError');
      setServerError(errorMessage);
      setUsernameError('');
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
