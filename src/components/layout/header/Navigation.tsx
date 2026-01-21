import React from 'react';
import { useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';
import { NavigationItem } from './NavigationItem';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {NAVIGATION_ITEMS.map((item) => (
        <NavigationItem
          key={item.path}
          item={item}
          isActive={location.pathname === item.path}
        />
      ))}
    </nav>
  );
};
