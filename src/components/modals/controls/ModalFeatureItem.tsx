import React from 'react';
import { ModalFeatureItemProps } from '../types';
import { MODAL_STYLES } from '../constants';

export const ModalFeatureItem: React.FC<ModalFeatureItemProps> = ({ text }) => {
  return (
    <div className="flex items-start" style={{ gap: '12px' }}>
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
