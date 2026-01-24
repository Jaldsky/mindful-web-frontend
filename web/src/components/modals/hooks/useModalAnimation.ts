import { useState, useEffect, useCallback } from 'react';
import { MODAL_ANIMATION } from '../constants';

interface UseModalAnimationReturn {
  isVisible: boolean;
  isTransitioning: boolean;
  handleTransition: (callback: () => void) => void;
}

export const useModalAnimation = (isOpen: boolean): UseModalAnimationReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
    }, MODAL_ANIMATION.TRANSITION_DURATION);
  }, []);

  return {
    isVisible,
    isTransitioning,
    handleTransition,
  };
};
