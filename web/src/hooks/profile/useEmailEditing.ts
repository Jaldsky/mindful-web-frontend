import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { storageManager } from '../../contexts';
import { STORAGE_KEYS } from '../../constants';
import { extractErrorMessage } from '../../utils';

interface UseEmailEditingParams {
  isAuthenticated: boolean;
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
  updateEmail: (email: string) => Promise<void>;
  onVerificationNeeded: (email: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  setServerError: (error: string | null) => void;
}

export const useEmailEditing = ({
  isAuthenticated,
  email,
  setEmail,
  updateEmail,
  onVerificationNeeded,
  t,
  setServerError,
}: UseEmailEditingParams) => {
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const lastEmailRequestAtRef = useRef<number | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const EMAIL_CHANGE_COOLDOWN_MS = 30000;

  const startEditEmail = () => {
    if (!isAuthenticated) return;
    setEmailInput(email || '');
    setEditingEmail(true);
    setEmailError('');
  };

  const handleSaveEmail = () => {
    const normalizedEmail = emailInput.trim();
    if (!normalizedEmail) {
      setEmailError(t('auth.errors.emailRequired'));
      return;
    }
    if (!normalizedEmail.includes('@')) {
      setEmailError(t('auth.errors.emailInvalid'));
      return;
    }
    if (!isAuthenticated) {
      storageManager.setItem(STORAGE_KEYS.USER_EMAIL, normalizedEmail);
      setEmail(normalizedEmail);
      setEditingEmail(false);
      setEmailError('');
      return;
    }

    if (isUpdatingEmail) {
      setEmailError(t('profile.emailChangeInProgress'));
      return;
    }

    if (lastEmailRequestAtRef.current) {
      const elapsedMs = Date.now() - lastEmailRequestAtRef.current;
      if (elapsedMs < EMAIL_CHANGE_COOLDOWN_MS) {
        const secondsLeft = Math.ceil((EMAIL_CHANGE_COOLDOWN_MS - elapsedMs) / 1000);
        setEmailError(t('profile.emailChangeCooldown', { seconds: secondsLeft }));
        return;
      }
    }

    const submitEmailChange = async () => {
      setIsUpdatingEmail(true);
      try {
        await updateEmail(normalizedEmail);
        lastEmailRequestAtRef.current = Date.now();
        setEditingEmail(false);
        setEmailError('');
        onVerificationNeeded(normalizedEmail);
      } catch (error: unknown) {
        setServerError(extractErrorMessage(error) || t('auth.genericError'));
      } finally {
        setIsUpdatingEmail(false);
      }
    };

    void submitEmailChange();
  };

  const handleCancelEmail = () => {
    setEmailInput(email || '');
    setEditingEmail(false);
    setEmailError('');
    setServerError(null);
  };

  return {
    editingEmail,
    emailInput,
    setEmailInput,
    emailError,
    startEditEmail,
    handleSaveEmail,
    handleCancelEmail,
  };
};
