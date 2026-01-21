/**
 * Timezone Hook
 * Manages user timezone detection and storage
 */

import { useState, useEffect } from 'react';
import { storageManager } from '../../contexts';
import { STORAGE_KEYS } from '../../constants';
import { timezoneDetector } from '../utils';
import type { UseTimezoneReturn } from '../types';

export const useTimezone = (): UseTimezoneReturn => {
  const [timezone, setTimezone] = useState<string>('');

  useEffect(() => {
    const savedTimezone = storageManager.getItem(STORAGE_KEYS.TIMEZONE);
    
    if (savedTimezone) {
      setTimezone(savedTimezone);
    } else {
      const detectedTimezone = timezoneDetector.detectTimezone();
      setTimezone(detectedTimezone);
      storageManager.setItem(STORAGE_KEYS.TIMEZONE, detectedTimezone);
    }
  }, []);

  const timezoneWithOffset = timezone
    ? timezoneDetector.formatTimezoneWithOffset(timezone)
    : '—';

  return {
    timezone,
    timezoneWithOffset,
  };
};
