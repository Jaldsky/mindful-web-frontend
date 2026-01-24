import { Dispatch, SetStateAction } from 'react';
import { storageManager } from '../../contexts';
import { STORAGE_KEYS } from '../../constants';

interface UseProfileTimezoneParams {
  setTimezone: Dispatch<SetStateAction<string>>;
}

export const useProfileTimezone = ({ setTimezone }: UseProfileTimezoneParams) => {
  const handleTimezoneChange = (newTimezone: string) => {
    if (!newTimezone) return;
    storageManager.setItem(STORAGE_KEYS.TIMEZONE, newTimezone);
    setTimezone(newTimezone);
  };

  return { handleTimezoneChange };
};
