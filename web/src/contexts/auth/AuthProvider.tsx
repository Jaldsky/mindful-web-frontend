import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext, UserContext } from '../contexts';
import { tokenManager } from './TokenManager';
import { welcomeManager } from './WelcomeManager';
import { authService, userService } from '../../services';
import { extractUserIdFromToken } from '../../utils';
import type { AuthContextType, AuthStatus } from '../types';
import type { UserProfile } from '../../types';

/**
 * Component that synchronizes userId with user profile from AuthProvider
 */
function UserIdSync() {
  const authContext = React.useContext(AuthContext);
  const userContext = React.useContext(UserContext);

  useEffect(() => {
    if (
      authContext &&
      userContext &&
      authContext.status === 'authenticated' &&
      authContext.user?.user_id
    ) {
      userContext.setUserId(authContext.user.user_id);
    }
  }, [authContext, userContext]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [anonId, setAnonId] = useState<string | null>(() => tokenManager.getAnonId());
  const [showWelcome, setShowWelcome] = useState(false);
  const bootstrapStartedRef = useRef(false);

  const reloadProfile = useCallback(async () => {
    const response = await userService.getProfile();
    const accessToken = tokenManager.getAccessToken();
    const userId = extractUserIdFromToken(accessToken);

    const profileData: UserProfile = {
      ...response.data,
      user_id: userId || response.data.user_id || '',
    };
    
    setUser(profileData);
  }, []);

  const ensureAnonymous = useCallback(async () => {
    const response = await authService.createAnonymous();
    tokenManager.setAnonymousTokens(response.anon_id, response.anon_token);
    setAnonId(response.anon_id);
    setStatus('anonymous');
    setShowWelcome(false);
  }, []);

  const dismissWelcome = useCallback(() => {
    welcomeManager.markWelcomeShown();
    setShowWelcome(false);
  }, []);

  const showWelcomeScreen = useCallback(() => {
    setShowWelcome(true);
    setStatus('welcome');
  }, []);

  useEffect(() => {
    if (status !== 'welcome' && status !== 'loading' && showWelcome) {
      setShowWelcome(false);
    }
  }, [status, showWelcome]);

  useEffect(() => {
    if (bootstrapStartedRef.current) return;
    bootstrapStartedRef.current = true;

    let isMounted = true;

    const bootstrap = async () => {
      const hasAccessToken = tokenManager.hasAccessToken();
      const hasAnonToken = tokenManager.hasAnonToken();

      if (hasAccessToken) {
        setStatus('authenticated');
        try {
          await reloadProfile();
          if (!isMounted) return;
        } catch {
          if (!isMounted) return;
          tokenManager.clearAccessTokens();
          
          if (welcomeManager.shouldShowWelcome(false, hasAnonToken)) {
            setStatus('welcome');
            setShowWelcome(true);
          } else {
            await ensureAnonymous();
          }
          return;
        }
        return;
      }

      if (hasAnonToken) {
        setStatus('anonymous');
        return;
      }

      if (welcomeManager.shouldShowWelcome(false, false)) {
        setStatus('welcome');
        setShowWelcome(true);
        return;
      }

      try {
        await ensureAnonymous();
      } catch {
        if (!isMounted) return;
        setStatus('anonymous');
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [ensureAnonymous, reloadProfile]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authService.login({ username, password });
      tokenManager.setAccessTokens(response.access_token, response.refresh_token);
      tokenManager.clearAnonymousTokens();
      setAnonId(null);
      setStatus('authenticated');
      setShowWelcome(false);
      welcomeManager.markWelcomeShown();
      await reloadProfile();
    },
    [reloadProfile]
  );

  const register = useCallback(async (username: string, email: string, password: string) => {
    await authService.register({ username, email, password });
  }, []);

  const verify = useCallback(async (email: string, code: string) => {
    await authService.verify({ email, code });
  }, []);

  const resendCode = useCallback(async (email: string) => {
    await authService.resendCode({ email });
  }, []);

  const refresh = useCallback(async () => {
    const refreshToken = tokenManager.getRefreshToken();
    const response = await authService.refresh({ refresh_token: refreshToken || undefined });
    tokenManager.setAccessTokens(response.access_token, response.refresh_token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenManager.clearAccessTokens();
      setUser(null);
      try {
        await ensureAnonymous();
      } catch {
        setStatus('anonymous');
      }
    }
  }, [ensureAnonymous]);

  const updateUsername = useCallback(async (username: string) => {
    const response = await userService.updateUsername({ username });
    setUser(response.data);
  }, []);

  const updateEmail = useCallback(async (email: string) => {
    const response = await userService.updateEmail({ email });
    setUser(response.data);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      status,
      user,
      anonId,
      showWelcome,
      dismissWelcome,
      showWelcomeScreen,
      login,
      register,
      verify,
      resendCode,
      logout,
      refresh,
      createAnonymous: ensureAnonymous,
      reloadProfile,
      updateUsername,
      updateEmail,
    }),
    [
      anonId,
      dismissWelcome,
      showWelcomeScreen,
      ensureAnonymous,
      login,
      logout,
      refresh,
      register,
      reloadProfile,
      resendCode,
      showWelcome,
      status,
      updateEmail,
      updateUsername,
      user,
      verify,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      <UserIdSync />
      {children}
    </AuthContext.Provider>
  );
}
