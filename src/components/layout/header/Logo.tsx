import React from 'react';
import { Link } from 'react-router-dom';
import { HEADER_STYLES } from '../constants';

export const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="transition-opacity hover:opacity-80"
      style={HEADER_STYLES.logo}
    >
      🧘 Mindful Web
    </Link>
  );
};
