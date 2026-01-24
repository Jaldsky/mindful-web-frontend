export interface PaginationMeta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  next: string | null;
  prev: string | null;
}

export interface DomainUsageStat {
  domain: string;
  category?: string;
  total_seconds: number;
}

export interface AnalyticsUsageResponse {
  code: string;
  message: string;
  from_date: string;
  to_date: string;
  pagination: PaginationMeta;
  data: DomainUsageStat[];
}

export interface AuthLoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthRegisterResponse {
  code: string;
  message: string;
}

export interface AuthVerifyResponse {
  code: string;
  message: string;
}

export interface AuthResendCodeResponse {
  code: string;
  message: string;
}

export interface AuthRefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthLogoutResponse {
  code: string;
  message: string;
}

export interface AuthAnonymousResponse {
  anon_id: string;
  anon_token: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  created_at: string;
  timezone: string;
}

export interface UserProfileResponse {
  code: string;
  message: string;
  data: UserProfile;
}
