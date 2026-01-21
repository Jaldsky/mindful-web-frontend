import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import {
  LocalStorageTokenStorage,
  ConsoleLogger,
  TokenProvider,
  TokenRefreshManager,
  AccessTokenRefreshStrategy,
  AnonTokenRefreshStrategy,
  ApiClient,
  ITokenStorage,
  ILogger,
} from '../../src/api/client';
import { STORAGE_KEYS, API_CONFIG } from '../../src/constants';

describe('LocalStorageTokenStorage', () => {
  let storage: LocalStorageTokenStorage;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageTokenStorage();
  });

  it('should set and get access token', () => {
    storage.setAccessToken('test-access');
    expect(storage.getAccessToken()).toBe('test-access');
  });

  it('should set and get refresh token', () => {
    storage.setRefreshToken('test-refresh');
    expect(storage.getRefreshToken()).toBe('test-refresh');
  });

  it('should set and get anon token', () => {
    storage.setAnonToken('test-anon');
    expect(storage.getAnonToken()).toBe('test-anon');
  });

  it('should set and get anon ID', () => {
    storage.setAnonId('anon-123');
    expect(storage.getAnonId()).toBe('anon-123');
  });

  it('should clear auth tokens', () => {
    storage.setAccessToken('access');
    storage.setRefreshToken('refresh');
    storage.clearAuthTokens();
    
    expect(storage.getAccessToken()).toBeNull();
    expect(storage.getRefreshToken()).toBeNull();
  });

  it('should clear anon tokens', () => {
    storage.setAnonToken('anon');
    storage.setAnonId('id');
    storage.clearAnonTokens();
    
    expect(storage.getAnonToken()).toBeNull();
    expect(storage.getAnonId()).toBeNull();
  });
});

describe('ConsoleLogger', () => {
  it('should not log in production mode', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const logger = new ConsoleLogger(false);
    
    logger.logRequest('GET', '/test');
    logger.logResponse(200, '/test');
    
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log in development mode', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const logger = new ConsoleLogger(true);
    
    logger.logRequest('GET', '/test', {});
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log errors in development mode', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const logger = new ConsoleLogger(true);
    
    logger.logError('Test error', 500, '/test');
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('TokenProvider', () => {
  let storage: ITokenStorage;
  let provider: TokenProvider;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageTokenStorage();
    provider = new TokenProvider(storage);
  });

  it('should return access token when available', () => {
    storage.setAccessToken('access-token');
    expect(provider.getAuthToken()).toBe('access-token');
  });

  it('should return anon token when access token not available', () => {
    storage.setAnonToken('anon-token');
    expect(provider.getAuthToken()).toBe('anon-token');
  });

  it('should prefer access token over anon token', () => {
    storage.setAccessToken('access-token');
    storage.setAnonToken('anon-token');
    expect(provider.getAuthToken()).toBe('access-token');
  });

  it('should return null when no tokens', () => {
    expect(provider.getAuthToken()).toBeNull();
  });

  it('should check if has access token', () => {
    expect(provider.hasAccessToken()).toBe(false);
    storage.setAccessToken('token');
    expect(provider.hasAccessToken()).toBe(true);
  });

  it('should check if has anon token', () => {
    expect(provider.hasAnonToken()).toBe(false);
    storage.setAnonToken('token');
    expect(provider.hasAnonToken()).toBe(true);
  });
});

describe('AccessTokenRefreshStrategy', () => {
  let storage: ITokenStorage;
  let mockRefreshClient: { post: ReturnType<typeof vi.fn> };
  let strategy: AccessTokenRefreshStrategy;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageTokenStorage();
    mockRefreshClient = {
      post: vi.fn(),
    };
    strategy = new AccessTokenRefreshStrategy(storage, mockRefreshClient);
  });

  it('should handle when access token exists', () => {
    storage.setAccessToken('token');
    expect(strategy.canHandle()).toBe(true);
  });

  it('should not handle when access token missing', () => {
    expect(strategy.canHandle()).toBe(false);
  });

  it('should refresh access token', async () => {
    storage.setAccessToken('old-access');
    storage.setRefreshToken('refresh');

    mockRefreshClient.post.mockResolvedValue({
      data: {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      },
    });

    const request = { headers: {} };
    const result = await strategy.refresh(request as InternalAxiosRequestConfig);

    expect(storage.getAccessToken()).toBe('new-access');
    expect(storage.getRefreshToken()).toBe('new-refresh');
    expect(result.headers.Authorization).toBe('Bearer new-access');
  });
});

describe('AnonTokenRefreshStrategy', () => {
  let storage: ITokenStorage;
  let mockRefreshClient: { post: ReturnType<typeof vi.fn> };
  let strategy: AnonTokenRefreshStrategy;

  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageTokenStorage();
    mockRefreshClient = {
      post: vi.fn(),
    };
    strategy = new AnonTokenRefreshStrategy(storage, mockRefreshClient);
  });

  it('should handle when anon token exists', () => {
    storage.setAnonToken('token');
    expect(strategy.canHandle()).toBe(true);
  });

  it('should not handle when anon token missing', () => {
    expect(strategy.canHandle()).toBe(false);
  });

  it('should refresh anon token', async () => {
    storage.setAnonToken('old-anon');

    mockRefreshClient.post.mockResolvedValue({
      data: {
        anon_token: 'new-anon',
        anon_id: 'anon-id-123',
      },
    });

    const request = { headers: {} };
    const result = await strategy.refresh(request as InternalAxiosRequestConfig);

    expect(storage.getAnonToken()).toBe('new-anon');
    expect(storage.getAnonId()).toBe('anon-id-123');
    expect(result.headers.Authorization).toBe('Bearer new-anon');
  });
});

describe('TokenRefreshManager', () => {
  let manager: TokenRefreshManager;
  let mockStrategy1: { canHandle: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn> };
  let mockStrategy2: { canHandle: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    manager = new TokenRefreshManager();
    mockStrategy1 = {
      canHandle: vi.fn().mockReturnValue(false),
      refresh: vi.fn(),
    };
    mockStrategy2 = {
      canHandle: vi.fn().mockReturnValue(true),
      refresh: vi.fn().mockResolvedValue({ headers: {} }),
    };
  });

  it('should use first suitable strategy', async () => {
    manager.addStrategy(mockStrategy1).addStrategy(mockStrategy2);

    const request = { headers: {} };
    await manager.refresh(request as InternalAxiosRequestConfig);

    expect(mockStrategy1.canHandle).toHaveBeenCalled();
    expect(mockStrategy1.refresh).not.toHaveBeenCalled();
    expect(mockStrategy2.canHandle).toHaveBeenCalled();
    expect(mockStrategy2.refresh).toHaveBeenCalled();
  });

  it('should throw error when no strategy can handle', async () => {
    manager.addStrategy(mockStrategy1);
    mockStrategy1.canHandle.mockReturnValue(false);

    const request = { headers: {} };
    await expect(manager.refresh(request as InternalAxiosRequestConfig)).rejects.toThrow('No suitable refresh strategy found');
  });

  it('should support method chaining', () => {
    const result = manager.addStrategy(mockStrategy1).addStrategy(mockStrategy2);
    expect(result).toBe(manager);
  });
});

describe('ApiClient', () => {
  class MockStorage implements ITokenStorage {
    private tokens = new Map<string, string>();
    getAccessToken() { return this.tokens.get('access') || null; }
    getRefreshToken() { return this.tokens.get('refresh') || null; }
    getAnonToken() { return this.tokens.get('anon') || null; }
    getAnonId() { return this.tokens.get('anonId') || null; }
    setAccessToken(token: string) { this.tokens.set('access', token); }
    setRefreshToken(token: string) { this.tokens.set('refresh', token); }
    setAnonToken(token: string) { this.tokens.set('anon', token); }
    setAnonId(id: string) { this.tokens.set('anonId', id); }
    clearAuthTokens() { this.tokens.delete('access'); this.tokens.delete('refresh'); }
    clearAnonTokens() { this.tokens.delete('anon'); this.tokens.delete('anonId'); }
  }

  class MockLogger implements ILogger {
    logRequest() {}
    logResponse() {}
    logError() {}
  }

  it('should create client with custom storage and logger', () => {
    const storage = new MockStorage();
    const logger = new MockLogger();
    const client = new ApiClient(storage, logger);

    expect(client.instance).toBeDefined();
  });

  it('should create client with factory method', () => {
    const client = ApiClient.create();
    expect(client.instance).toBeDefined();
  });

  it('should create client with default dependencies', () => {
    const client = ApiClient.create(new LocalStorageTokenStorage(), new ConsoleLogger());
    expect(client.instance).toBeDefined();
  });
});

describe('API Configuration', () => {
  it('should have valid base URL', () => {
    expect(API_CONFIG.BASE_URL).toBeDefined();
    expect(typeof API_CONFIG.BASE_URL).toBe('string');
  });

  it('should have valid timeout', () => {
    expect(API_CONFIG.TIMEOUT).toBeDefined();
    expect(typeof API_CONFIG.TIMEOUT).toBe('number');
    expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
  });

  it('should have reasonable timeout value', () => {
    expect(API_CONFIG.TIMEOUT).toBeGreaterThanOrEqual(5000);
    expect(API_CONFIG.TIMEOUT).toBeLessThanOrEqual(60000);
  });
});

describe('Storage Keys', () => {
  it('should have all required storage keys', () => {
    expect(STORAGE_KEYS.ACCESS_TOKEN).toBeDefined();
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBeDefined();
    expect(STORAGE_KEYS.ANON_TOKEN).toBeDefined();
    expect(STORAGE_KEYS.ANON_ID).toBeDefined();
  });

  it('should use consistent naming', () => {
    expect(STORAGE_KEYS.ACCESS_TOKEN).toContain('access');
    expect(STORAGE_KEYS.REFRESH_TOKEN).toContain('refresh');
    expect(STORAGE_KEYS.ANON_TOKEN).toContain('anon');
  });
});
