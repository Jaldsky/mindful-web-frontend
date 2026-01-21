import React from 'react';
import { Header } from './header';
import { LAYOUT_STYLES } from './constants';
import type { LayoutProps } from './types';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen" style={LAYOUT_STYLES.container}>
      <Header />

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={LAYOUT_STYLES.main}
      >
        {children}
      </main>
    </div>
  );
};
