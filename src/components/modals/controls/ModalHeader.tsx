import React from 'react';
import { ModalHeaderProps } from '../types';
import { MODAL_ANIMATION } from '../constants';

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  shouldAnimate = true,
}) => {
  return (
    <div
      className="text-center"
      style={{
        transition: shouldAnimate ? 'opacity 0.3s ease' : 'none',
        animation: shouldAnimate ? `slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${MODAL_ANIMATION.FADE_DELAYS.HEADER} backwards` : 'none',
        marginTop: 0,
        marginBottom: 'var(--spacing-lg)',
      }}
    >
        <h2
          className="text-center font-bold"
          style={{
            color: 'var(--color-primary)',
            fontSize: '32px',
            marginTop: '0',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {title}
        </h2>
        <p
          className="leading-relaxed"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            lineHeight: '1.5',
            marginBottom: 'var(--spacing-md)',
            marginTop: 0,
          }}
        >
          {subtitle}
        </p>
    </div>
  );
};
