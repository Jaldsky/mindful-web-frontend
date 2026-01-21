import { describe, it, expect } from 'vitest';
import type {
  IAnalyticsService,
  IAuthService,
  IUserService,
} from '../../src/services/interfaces';
import { AnalyticsService } from '../../src/services/analytics/AnalyticsService';
import { AuthService } from '../../src/services/auth/AuthService';
import { UserService } from '../../src/services/user/UserService';

describe('Service Interfaces', () => {
  describe('IAnalyticsService', () => {
    it('should be implemented by AnalyticsService', () => {
      const service: IAnalyticsService = new AnalyticsService();

      expect(service).toBeDefined();
      expect(service.getUsage).toBeDefined();
      expect(typeof service.getUsage).toBe('function');
    });

    it('should have correct interface structure', () => {
      const service = new AnalyticsService();
      
      // Check that service implements the interface
      const interfaceCheck: IAnalyticsService = service;
      expect(interfaceCheck).toBe(service);
    });
  });

  describe('IAuthService', () => {
    it('should be implemented by AuthService', () => {
      const service: IAuthService = new AuthService();

      expect(service).toBeDefined();
      expect(service.login).toBeDefined();
      expect(service.register).toBeDefined();
      expect(service.verify).toBeDefined();
      expect(service.resendCode).toBeDefined();
      expect(service.refresh).toBeDefined();
      expect(service.logout).toBeDefined();
      expect(service.createAnonymous).toBeDefined();
      
      expect(typeof service.login).toBe('function');
      expect(typeof service.register).toBe('function');
      expect(typeof service.verify).toBe('function');
      expect(typeof service.resendCode).toBe('function');
      expect(typeof service.refresh).toBe('function');
      expect(typeof service.logout).toBe('function');
      expect(typeof service.createAnonymous).toBe('function');
    });

    it('should have correct interface structure', () => {
      const service = new AuthService();
      
      // Check that service implements the interface
      const interfaceCheck: IAuthService = service;
      expect(interfaceCheck).toBe(service);
    });
  });

  describe('IUserService', () => {
    it('should be implemented by UserService', () => {
      const service: IUserService = new UserService();

      expect(service).toBeDefined();
      expect(service.getProfile).toBeDefined();
      expect(service.updateUsername).toBeDefined();
      expect(service.updateEmail).toBeDefined();
      
      expect(typeof service.getProfile).toBe('function');
      expect(typeof service.updateUsername).toBe('function');
      expect(typeof service.updateEmail).toBe('function');
    });

    it('should have correct interface structure', () => {
      const service = new UserService();
      
      // Check that service implements the interface
      const interfaceCheck: IUserService = service;
      expect(interfaceCheck).toBe(service);
    });
  });
});
