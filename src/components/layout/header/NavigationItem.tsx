import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { HEADER_STYLES } from '../constants';
import type { NavigationItem as NavItemType } from '../types';

interface NavigationItemProps {
  item: NavItemType;
  isActive: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, isActive }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  const getStyle = () => {
    if (isActive) {
      return HEADER_STYLES.navLink.active;
    }
    if (isHovered) {
      return { ...HEADER_STYLES.navLink.inactive, backgroundColor: 'var(--color-bg-secondary)' };
    }
    return HEADER_STYLES.navLink.inactive;
  };

  return (
    <Link
      to={item.path}
      className="px-3 py-2 rounded text-sm font-medium transition-all"
      style={getStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <span>{t(item.labelKey)}</span>
      </div>
    </Link>
  );
};
