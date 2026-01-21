/**
 * Services
 * Barrel export for all service classes and related types
 */

export { AnalyticsService, analyticsService } from './analytics';
export { AuthService, authService } from './auth';
export { UserService, userService } from './user';

export type {
  IAnalyticsService,
  IAuthService,
  IUserService,
} from './interfaces';

export type {
  AnalyticsRequestParams,
  LoginPayload,
  RegisterPayload,
  VerifyPayload,
  ResendCodePayload,
  RefreshPayload,
  UpdateUsernamePayload,
  UpdateEmailPayload,
} from './types';
