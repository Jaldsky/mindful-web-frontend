/**
 * Home Entrance Animation Hook
 * Provides visibility state for entrance animations
 */

import { useEffect, useState } from 'react';

export const useHomeEntranceAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return isVisible;
};
