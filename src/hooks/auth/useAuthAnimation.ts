/**
 * Auth Animation Hook
 * Handles smooth screen transitions with height/width animations
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { AuthScreen } from '../../components/auth';
import type { UseAuthAnimationReturn } from '../types';

export const useAuthAnimation = (
  initialScreen: AuthScreen = 'login',
  isExiting = false
): UseAuthAnimationReturn => {
  const [activeScreen, setActiveScreen] = useState<AuthScreen>(initialScreen);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayScreen, setDisplayScreen] = useState<AuthScreen>(initialScreen);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>('auto');
  const [containerWidth, setContainerWidth] = useState<string>('100%');

  // Reset height to auto when exiting
  useEffect(() => {
    if (isExiting) {
      setContainerHeight('auto');
      setContainerWidth('100%');
    }
  }, [isExiting]);

  const switchScreen = useCallback((newScreen: AuthScreen) => {
    if (newScreen === activeScreen || isTransitioning) return;
    
    const container = containerRef.current;
    if (!container) {
      setDisplayScreen(newScreen);
      setActiveScreen(newScreen);
      return;
    }

    // Prevent scrollbar flickering
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Get current dimensions
    const currentHeight = container.scrollHeight;
    const currentWidth = container.offsetWidth;
    
    setContainerHeight(`${currentHeight}px`);
    setContainerWidth(`${currentWidth}px`);
    
    setIsMeasuring(true);
    setDisplayScreen(newScreen);
    setActiveScreen(newScreen);
    
    // Triple RAF for DOM update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!container) return;
          
          const formElement = container.querySelector('.auth-form');
          if (!formElement) return;
          
          formElement.getBoundingClientRect();
          
          const newHeight = container.scrollHeight;
          const newWidth = container.offsetWidth;
          
          setIsMeasuring(false);
          setIsTransitioning(true);
          
          requestAnimationFrame(() => {
            setContainerHeight(`${newHeight}px`);
            setContainerWidth(`${newWidth}px`);
          });
          
          setTimeout(() => {
            setIsTransitioning(false);
            setContainerHeight('auto');
            setContainerWidth('100%');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }, 300);
        });
      });
    });
  }, [activeScreen, isTransitioning]);

  return {
    activeScreen,
    displayScreen,
    isTransitioning,
    isMeasuring,
    containerHeight,
    containerWidth,
    containerRef,
    switchScreen,
  };
};
