/**
 * User Context
 * Manages user ID state
 * Following React Context pattern
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants';

interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  generateUserId: () => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  });

  const generateUserId = useCallback((): string => {
    const newId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.USER_ID, newId);
    setUserIdState(newId);
    return newId;
  }, []);

  useEffect(() => {
    // Ensure user ID exists
    if (!userId) {
      generateUserId();
    }
  }, [userId, generateUserId]);

  const setUserId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
    setUserIdState(id);
  }, []);

  const value: UserContextType = {
    userId,
    setUserId,
    generateUserId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

