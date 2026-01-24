/**
 * Page Types
 * Common types used across pages
 */

export interface MessageState {
  error: string | null;
  success: string | null;
}

export interface AuthFormState extends MessageState {
  loading: boolean;
  registeredEmail: string;
}
