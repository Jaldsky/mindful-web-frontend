import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { LAYOUT_STYLES } from './constants';
import type { LayoutProps } from './types';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        ...LAYOUT_STYLES.container,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <main
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"
        style={{
          ...LAYOUT_STYLES.main,
          flex: 1,
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};
