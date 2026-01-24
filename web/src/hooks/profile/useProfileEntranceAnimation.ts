import { useEffect, useRef, useState } from 'react';

export const useProfileEntranceAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    const children = Array.from(containerRef.current.children) as HTMLElement[];
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(10px)';
      child.style.transition = 'none';
      setTimeout(() => {
        child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * 50);
    });
  }, [isVisible]);

  return { isVisible, containerRef };
};
