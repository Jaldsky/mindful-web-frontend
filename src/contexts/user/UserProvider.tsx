import React, { useState, useEffect, useCallback } from 'react';
import { UserContext } from '../contexts';
import { storageManager } from '../utils';
import { userIdGenerator } from './UserIdGenerator';
import { STORAGE_KEYS } from '../../constants';
import type { UserContextType } from '../types';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(() => {
    return storageManager.getItem(STORAGE_KEYS.USER_ID);
  });

  const generateUserId = useCallback((): string => {
    const newId = userIdGenerator.generateId();
    storageManager.setItem(STORAGE_KEYS.USER_ID, newId);
    setUserIdState(newId);
    return newId;
  }, []);

  useEffect(() => {
    if (!userId) {
      generateUserId();
    }
  }, [userId, generateUserId]);

  const setUserId = useCallback((id: string) => {
    storageManager.setItem(STORAGE_KEYS.USER_ID, id);
    setUserIdState(id);
  }, []);

  const value: UserContextType = {
    userId,
    setUserId,
    generateUserId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
