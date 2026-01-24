import React from 'react';
import { ModalFeatureItemProps } from '../types';
import { MODAL_STYLES, MODAL_ANIMATION } from '../constants';

export const ModalFeatureItem: React.FC<ModalFeatureItemProps> = ({ text, index = 0, shouldAnimate = true }) => {
  const delayKey = `FEATURE${index + 1}` as keyof typeof MODAL_ANIMATION.FADE_DELAYS;
  const delay = MODAL_ANIMATION.FADE_DELAYS[delayKey] || MODAL_ANIMATION.FADE_DELAYS.FEATURE1;

  return (
    <div
      className="flex items-start"
      style={{
        gap: '10px',
        animation: shouldAnimate ? `slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay} backwards` : 'none',
      }}
    >
      <span
        style={{
          color: 'var(--color-primary)',
          fontSize: MODAL_STYLES.FEATURE_ITEM.ICON.fontSize,
          lineHeight: '1.6',
          flexShrink: 0,
          marginTop: MODAL_STYLES.FEATURE_ITEM.ICON.marginTop,
        }}
      >
        ◆
      </span>
      <p
        style={{
          color: 'var(--color-text-primary)',
          fontSize: MODAL_STYLES.FEATURE_ITEM.TEXT.fontSize,
          lineHeight: MODAL_STYLES.FEATURE_ITEM.TEXT.lineHeight,
        }}
      >
        {text}
      </p>
    </div>
  );
};
