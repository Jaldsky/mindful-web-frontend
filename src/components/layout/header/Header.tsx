import React from 'react';
import { HEADER_STYLES } from '../constants';
import { Logo } from './Logo';
import { AuthButton } from './AuthButton';
import { Navigation } from './Navigation';
import { HeaderControls } from './HeaderControls';

export const Header: React.FC = () => {
  return (
    <header
      className="sticky top-0 z-10 border-b"
      style={HEADER_STYLES.container}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <AuthButton />
          <Navigation />
          <HeaderControls />
        </div>
      </div>
    </header>
  );
};
