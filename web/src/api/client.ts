import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants';
import { AuthRefreshResponse } from '../types';

function getAcceptLanguage(): string {
  const supported = new Set(['en', 'ru']);

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
    if (stored && supported.has(stored)) return stored;
  } catch {
    // ignore storage access errors (e.g. SSR/tests)
  }

  if (typeof navigator !== 'undefined') {
    const lang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (supported.has(lang)) return lang;
  }

  return 'en';
}

export interface ITokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearAuthTokens(): void;
}

export interface ILogger {
  logRequest(method: string, url: string, params?: unknown): void;
  logResponse(status: number, url: string): void;
  logError(message: string, status?: number, url?: string): void;
}

export interface ITokenRefreshStrategy {
  refresh(originalRequest: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>;
  canHandle(): boolean;
}

export class LocalStorageTokenStorage implements ITokenStorage {
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }


  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }


  clearAuthTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

}

export class ConsoleLogger implements ILogger {
  constructor(private isDevelopment: boolean = import.meta.env.DEV) {}

  logRequest(method: string, url: string, params?: unknown): void {
    if (!this.isDevelopment) return;
    console.log('API Request:', { method, url, params });
  }

  logResponse(status: number, url: string): void {
    if (!this.isDevelopment) return;
    console.log('API Response:', { status, url });
  }

  logError(message: string, status?: number, url?: string): void {
    if (!this.isDevelopment) return;
    console.error('API Error:', { message, status, url });
  }
}

export class TokenProvider {
  constructor(private storage: ITokenStorage) {}

  getAuthToken(): string | null {
    return this.storage.getAccessToken();
  }

  hasAccessToken(): boolean {
    return !!this.storage.getAccessToken();
  }

}

export class AccessTokenRefreshStrategy implements ITokenRefreshStrategy {
  constructor(
    private storage: ITokenStorage,
    private refreshClient: AxiosInstance
  ) {}

  canHandle(): boolean {
    return !!this.storage.getAccessToken();
  }

  async refresh(originalRequest: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    const refreshToken = this.storage.getRefreshToken();
    
    const response = await this.refreshClient.post<AuthRefreshResponse>(
      '/auth/refresh',
      refreshToken ? { refresh_token: refreshToken } : undefined
    );

    this.storage.setAccessToken(response.data.access_token);
    this.storage.setRefreshToken(response.data.refresh_token);

    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

    return originalRequest;
  }
}

export class TokenRefreshManager {
  private strategies: ITokenRefreshStrategy[] = [];

  addStrategy(strategy: ITokenRefreshStrategy): this {
    this.strategies.push(strategy);
    return this;
  }

  async refresh(originalRequest: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    for (const strategy of this.strategies) {
      if (strategy.canHandle()) {
        return await strategy.refresh(originalRequest);
      }
    }
    throw new Error('No suitable refresh strategy found');
  }
}

export class RequestInterceptor {
  constructor(
    private tokenProvider: TokenProvider,
    private logger: ILogger
  ) {}

  onFulfilled = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authToken = this.tokenProvider.getAuthToken();
    
    config.headers = config.headers || {};

    config.headers['Accept-Language'] = getAcceptLanguage();

    if (authToken) config.headers.Authorization = `Bearer ${authToken}`;

    this.logger.logRequest(
      config.method?.toUpperCase() || '',
      `${config.baseURL}${config.url}`,
      config.params
    );

    return config;
  };

  onRejected = (error: unknown): Promise<never> => {
    return Promise.reject(error);
  };
}

export class ResponseInterceptor {
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor(
    private client: AxiosInstance,
    private refreshManager: TokenRefreshManager,
    private storage: ITokenStorage,
    private logger: ILogger
  ) {}

  onFulfilled = (response: AxiosResponse): AxiosResponse => {
    this.logger.logResponse(response.status, response.config.url || '');
    return response;
  };

  /** Endpoints where 401 means "bad credentials/code", not "token expired". Do not try refresh. */
  private static readonly AUTH_ERROR_PATHS = [
    '/auth/login',
    '/auth/register',
    '/auth/verify',
    '/auth/resend-code',
    '/auth/anonymous',
  ];

  onRejected = async (error: AxiosError): Promise<never> => {
    this.logger.logError(
      error.message,
      error.response?.status,
      error.config?.url
    );

    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestPath = (originalRequest.baseURL || '') + (originalRequest.url || '');
    const isAuthErrorEndpoint = ResponseInterceptor.AUTH_ERROR_PATHS.some((path) =>
      requestPath.includes(path)
    );
    if (isAuthErrorEndpoint) {
      return Promise.reject(error);
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      }).then(() => this.client(originalRequest));
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      await this.refreshManager.refresh(originalRequest);
      
      this.refreshQueue.forEach(({ resolve }) => resolve(null));
      this.refreshQueue = [];
      
      return this.client(originalRequest);
    } catch (refreshError) {
      this.storage.clearAuthTokens();
      
      this.refreshQueue.forEach(({ reject }) => reject(refreshError));
      this.refreshQueue = [];
      
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  };
}

export class ApiClient {
  private client: AxiosInstance;
  private refreshClient: AxiosInstance;

  constructor(
    private storage: ITokenStorage,
    private logger: ILogger,
    private config: typeof API_CONFIG = API_CONFIG
  ) {
    this.client = this.createClient();
    this.refreshClient = this.createRefreshClient();
    this.setupInterceptors();
  }

  private createClient(): AxiosInstance {
    return axios.create({
      baseURL: this.config.BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: this.config.TIMEOUT,
      withCredentials: true,
    });
  }

  private createRefreshClient(): AxiosInstance {
    return axios.create({
      baseURL: this.config.BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: this.config.TIMEOUT,
      withCredentials: true,
    });
  }

  private setupInterceptors(): void {
    const tokenProvider = new TokenProvider(this.storage);
    const requestInterceptor = new RequestInterceptor(tokenProvider, this.logger);

    const refreshManager = new TokenRefreshManager()
      .addStrategy(new AccessTokenRefreshStrategy(this.storage, this.refreshClient));

    const responseInterceptor = new ResponseInterceptor(
      this.client,
      refreshManager,
      this.storage,
      this.logger
    );

    this.client.interceptors.request.use(
      requestInterceptor.onFulfilled,
      requestInterceptor.onRejected
    );

    this.refreshClient.interceptors.request.use(
      requestInterceptor.onFulfilled,
      requestInterceptor.onRejected
    );

    this.client.interceptors.response.use(
      responseInterceptor.onFulfilled,
      responseInterceptor.onRejected
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }

  static create(
    storage: ITokenStorage = new LocalStorageTokenStorage(),
    logger: ILogger = new ConsoleLogger()
  ): ApiClient {
    return new ApiClient(storage, logger);
  }
}

export const apiClient = ApiClient.create().instance;
