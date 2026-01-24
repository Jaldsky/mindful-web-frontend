import { Dispatch, SetStateAction, useState } from 'react';
import { storageManager } from '../../contexts';
import { STORAGE_KEYS } from '../../constants';

interface UseProfileEditingParams {
  isAuthenticated: boolean;
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
  username: string | null;
  setUsername: Dispatch<SetStateAction<string | null>>;
  updateUsername: (username: string) => Promise<void>;
  t: (key: string) => string;
  setServerError: (error: string | null) => void;
}

export const useProfileEditing = ({
  isAuthenticated,
  email,
  setEmail,
  username,
  setUsername,
  updateUsername,
  t,
  setServerError,
}: UseProfileEditingParams) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');

  const startEditUsername = () => {
    if (!isAuthenticated) return;
    setUsernameInput(username || email?.split('@')[0] || '');
    setEditingUsername(true);
    setUsernameError('');
  };

  const startEditEmail = () => {
    if (!isAuthenticated) return;
    setEmailInput(email || '');
    setEditingEmail(true);
    setEmailError('');
  };

  const handleSaveEmail = () => {
    if (!emailInput) {
      setEmailError(t('auth.errors.emailRequired'));
      return;
    }
    if (!emailInput.includes('@')) {
      setEmailError(t('auth.errors.emailInvalid'));
      return;
    }
    storageManager.setItem(STORAGE_KEYS.USER_EMAIL, emailInput);
    setEmail(emailInput);
    setEditingEmail(false);
    setEmailError('');
  };

  const handleCancelEmail = () => {
    setEmailInput(email || '');
    setEditingEmail(false);
    setEmailError('');
    setServerError(null);
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
  };
};
