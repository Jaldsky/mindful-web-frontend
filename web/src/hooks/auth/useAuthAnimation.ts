/**
 * Auth Animation Hook
 * Handles smooth screen transitions with height/width animations
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
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

  useEffect(() => {
    if (isExiting) {
      setContainerHeight('auto');
      setContainerWidth('100%');
    }
  }, [isExiting]);

  const switchScreen = useCallback((newScreen: AuthScreen) => {
    if (newScreen === activeScreen || isTransitioning) {
      return;
    }
    
    const container = containerRef.current;
    if (!container) {
      setDisplayScreen(newScreen);
      setActiveScreen(newScreen);
      return;
    }

    const currentHeight = container.scrollHeight;
    const currentWidth = container.offsetWidth;
    
    container.style.height = `${currentHeight}px`;
    container.style.width = `${currentWidth}px`;
    
    flushSync(() => {
      setContainerHeight(`${currentHeight}px`);
      setContainerWidth(`${currentWidth}px`);
    });
    
    void container.offsetHeight;
    
    setIsMeasuring(true);
    
    requestAnimationFrame(() => {
      void container.offsetHeight;
      
      setDisplayScreen(newScreen);
      setActiveScreen(newScreen);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!container) return;
          
          const formElement = container.querySelector('.auth-form') as HTMLElement | null;
          if (!formElement) return;
          
          const tempHeight = window.getComputedStyle(container).height;
          const tempWidth = window.getComputedStyle(container).width;
          
          const originalFormOpacity = formElement.style.opacity;
          const originalFormVisibility = formElement.style.visibility;
          const originalFormPosition = formElement.style.position;
          
          formElement.style.opacity = '1';
          formElement.style.visibility = 'visible';
          formElement.style.position = 'relative';
          
          container.style.height = 'auto';
          container.style.width = 'auto';
          
          void container.offsetHeight;
          formElement.getBoundingClientRect();
          
          const newHeight = container.scrollHeight;
          const newWidth = container.offsetWidth;
          
          formElement.style.opacity = originalFormOpacity;
          formElement.style.visibility = originalFormVisibility;
          formElement.style.position = originalFormPosition;
          
          container.style.height = tempHeight;
          container.style.width = tempWidth;
          
          void container.offsetHeight;
          
          if (newHeight === 0 || newWidth === 0) {
            setTimeout(() => {
              if (!container) return;
              const retryHeight = container.scrollHeight;
              const retryWidth = container.offsetWidth;
              if (retryHeight > 0 && retryWidth > 0) {
                setIsTransitioning(true);
                void container.offsetHeight;
                flushSync(() => {
                  setContainerHeight(`${retryHeight}px`);
                  setContainerWidth(`${retryWidth}px`);
                });
                setTimeout(() => {
                  setIsMeasuring(false);
                }, 16);
              }
            }, 50);
            return;
          }
          
          flushSync(() => {
            setIsTransitioning(true);
          });
          
          void container.offsetHeight;
          
          requestAnimationFrame(() => {
            void container.offsetHeight;
            
            flushSync(() => {
              setContainerHeight(`${newHeight}px`);
              setContainerWidth(`${newWidth}px`);
            });
            
            void container.offsetHeight;
          });
          
          setIsMeasuring(false);
          
          const resetToAuto = () => {
            if (!container) return;
            setTimeout(() => {
              if (container) {
                flushSync(() => {
                  setContainerHeight('auto');
                  setContainerWidth('100%');
                });
              }
            }, 100);
          };
          
          const handleTransitionEnd = () => {
            setIsTransitioning(false);
            container.removeEventListener('transitionend', handleTransitionEnd);
            resetToAuto();
          };
          
          container.addEventListener('transitionend', handleTransitionEnd);
          
          setTimeout(() => {
            setIsTransitioning(false);
            container.removeEventListener('transitionend', handleTransitionEnd);
            resetToAuto();
          }, 500);
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
