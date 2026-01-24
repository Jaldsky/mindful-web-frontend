/**
 * Service Types
 * Centralized type definitions for all services
 */

export type AnalyticsRequestParams = {
  from: string;
  to: string;
  page?: number;
};

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

export type UpdateUsernamePayload = {
  username: string;
};

export type UpdateEmailPayload = {
  email: string;
};
