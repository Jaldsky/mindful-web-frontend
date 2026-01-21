/**
 * Service Types
 * Centralized type definitions for all services
 */

// ============================================
// Analytics Service Types
// ============================================

export type AnalyticsRequestParams = {
  from: string;
  to: string;
  page?: number;
};

// ============================================
// Auth Service Types
// ============================================

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type VerifyPayload = {
  email: string;
  code: string;
};

export type ResendCodePayload = {
  email: string;
};

export type RefreshPayload = {
  refresh_token?: string | null;
};

// ============================================
// User Service Types
// ============================================

export type UpdateUsernamePayload = {
  username: string;
};

export type UpdateEmailPayload = {
  email: string;
};
