/**
 * Contexts
 * All React contexts in one place for better organization
 */

import { createContext } from 'react';
import type { AuthContextType, ThemeContextType, LocaleContextType, UserContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
export const UserContext = createContext<UserContextType | undefined>(undefined);
