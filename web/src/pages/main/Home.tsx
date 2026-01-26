/**
 * Home Page Component
 * Main landing page with Extension download and Features
 */

import React from 'react';
import { Layout } from '../../components/layout';
import { useHomeEntranceAnimation } from '../../hooks';
import {
  WelcomeBanner,
  FeaturesSection,
  ExtensionSection,
} from '../../components/home';

export const Home: React.FC = () => {
  const isVisible = useHomeEntranceAnimation();

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <WelcomeBanner isVisible={isVisible} />
        <FeaturesSection isVisible={isVisible} />
        <ExtensionSection isVisible={isVisible} />
      </div>
    </Layout>
  );
};
