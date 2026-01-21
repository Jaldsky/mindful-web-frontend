import { ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from 'react';

// Button types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

// Input types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

// Card types
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  noPadding?: boolean;
}

// Feedback types
export type MessageVariant = 'error' | 'info' | 'success' | 'warning';

export interface MessageProps {
  message: string;
  className?: string;
}

export interface BaseMessageProps extends MessageProps {
  variant: MessageVariant;
}

// Loader types
export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  className?: string;
}
