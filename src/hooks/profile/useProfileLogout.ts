import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

interface UseProfileLogoutParams {
  logout: () => Promise<void>;
  navigate: NavigateFunction;
}

export const useProfileLogout = ({ logout, navigate }: UseProfileLogoutParams) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    isLogoutHovered,
    setIsLogoutHovered,
    handleLogout,
  };
};
