import React, { useState } from 'react';
import { HEADER_STYLES } from '../constants';
import { Logo } from './Logo';
import { BurgerButton } from './BurgerButton';
import { Navigation } from './Navigation';
import { AuthButton } from './AuthButton';
import { HeaderControls } from './HeaderControls';
import { Sidebar } from '../sidebar';

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-10 border-b"
        style={HEADER_STYLES.container}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flexShrink: 0 }}>
            <div className="md:hidden flex-shrink-0">
              <BurgerButton
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isOpen={isSidebarOpen}
              />
            </div>
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <Navigation />
          </div>

          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <AuthButton />
            <HeaderControls />
          </div>
        </div>
      </header>
      <div className="md:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};
