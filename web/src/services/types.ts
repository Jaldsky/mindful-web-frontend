/**
 * Service Types
 * Centralized type definitions for all services
 */

export type AnalyticsRequestParams = {
  from: string;
  to: string;
  page?: number;
  per_page?: number;
  sort_by?: 'total_seconds' | 'domain' | 'category';
  order?: 'asc' | 'desc';
  search?: string | null;
};

export type AnalyticsSummaryRequestParams = {
  from: string;
  to: string;
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

export type OAuthLoginPayload = {
  code: string;
  redirect_uri: string;
  state?: string;
  code_verifier?: string;
};

export type UpdateUsernamePayload = {
  username: string;
};

export type UpdateEmailPayload = {
  email: string;
};
