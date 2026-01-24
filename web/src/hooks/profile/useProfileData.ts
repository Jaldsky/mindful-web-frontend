import { useEffect, useState } from 'react';
import { storageManager } from '../../contexts';
import { STORAGE_KEYS } from '../../constants';
import { UserProfile } from '../../types';

interface UseProfileDataParams {
  isAuthenticated: boolean;
  authUser: UserProfile | null;
  detectedTimezone: string;
}

export const useProfileData = ({
  isAuthenticated,
  authUser,
  detectedTimezone,
}: UseProfileDataParams) => {
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>('');

  useEffect(() => {
    if (isAuthenticated && authUser) {
      if (authUser.email) setEmail(authUser.email);
      if (authUser.username) setUsername(authUser.username);
    } else {
      const savedEmail = storageManager.getItem(STORAGE_KEYS.USER_EMAIL);
      const savedUsername = storageManager.getItem(STORAGE_KEYS.USERNAME);
      if (savedEmail) setEmail(savedEmail);
      if (savedUsername) setUsername(savedUsername);
    }

    const savedTimezone = storageManager.getItem(STORAGE_KEYS.TIMEZONE);
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      setTimezone(detectedTimezone);
    }
  }, [isAuthenticated, authUser, detectedTimezone]);

  return {
    email,
    setEmail,
    username,
    setUsername,
    timezone,
    setTimezone,
  };
};
