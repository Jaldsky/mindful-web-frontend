import React from 'react';
import { ModalActionButtonsProps } from '../types';
import { MODAL_ANIMATION } from '../constants';

export const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
  onSignIn,
  onAnonymous,
  disabled,
  signInText,
  anonymousText,
}) => {
  return (
    <div
      className="button-group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        marginTop: 'var(--spacing-lg)',
        animation: `fadeIn 0.3s ease ${MODAL_ANIMATION.FADE_DELAYS.ACTIONS} backwards`,
      }}
    >
      <button
        onClick={onSignIn}
        disabled={disabled}
        className="btn-base btn-primary w-full"
      >
        {signInText}
      </button>

      <button
        onClick={onAnonymous}
        disabled={disabled}
        className="btn-base btn-secondary w-full"
      >
        {anonymousText}
      </button>
    </div>
  );
};
