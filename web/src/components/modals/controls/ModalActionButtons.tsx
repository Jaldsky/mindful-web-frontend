import React from 'react';
import { ModalActionButtonsProps } from '../types';
import { MODAL_ANIMATION } from '../constants';

export const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
  onSignIn,
  onAnonymous,
  disabled,
  signInText,
  anonymousText,
  shouldAnimate = true,
}) => {
  return (
    <div
      className="button-group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        marginTop: 'var(--spacing-md)',
        animation: shouldAnimate ? `slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${MODAL_ANIMATION.FADE_DELAYS.ACTIONS} backwards` : 'none',
      }}
    >
      <button
        onClick={onSignIn}
        disabled={disabled}
        className="btn-base btn-primary btn-signin w-full"
      >
        {signInText}
      </button>

      <button
        onClick={onAnonymous}
        disabled={disabled}
        className="btn-base btn-secondary btn-anonymous w-full"
      >
        {anonymousText}
      </button>
    </div>
  );
};
