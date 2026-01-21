import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../../contexts';
import { HEADER_STYLES } from '../constants';

export const AuthButton: React.FC = () => {
  const { status } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const isAuthenticated = status === 'authenticated';

  if (isAuthenticated) {
    return null;
  }

  const currentStyle = isHovered
    ? { ...HEADER_STYLES.primaryButton.base, ...HEADER_STYLES.primaryButton.hover }
    : HEADER_STYLES.primaryButton.base;

  return (
    <Link
      to="/auth"
      className="px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 border"
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LogIn size={16} />
      <span>Sign In</span>
    </Link>
  );
};
