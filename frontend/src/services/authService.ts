// Authentication service - API calls for auth operations

import { apiRequest } from './api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  OTPRequest,
  OTPVerify,
  RefreshTokenRequest,
  User,
} from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest.post<AuthResponse>('/auth/register', data);
    if (response.data) {
      this.storeAuthData(response.data);
    }
    return response.data!;
  }

  /**
   * Login with NIC and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest.post<AuthResponse>('/auth/login', credentials);
    if (response.data) {
      this.storeAuthData(response.data);
    }
    return response.data!;
  }

  /**
   * Request OTP for phone verification
   */
  async requestOTP(phone: string): Promise<ApiResponse> {
    const data: OTPRequest = { phone };
    return await apiRequest.post('/auth/otp/request', data);
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(phone: string, code: string): Promise<ApiResponse> {
    const data: OTPVerify = { phone, code };
    return await apiRequest.post('/auth/otp/verify', data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const data: RefreshTokenRequest = { refreshToken };
    const response = await apiRequest.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      data
    );

    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data!;
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiRequest.get<User>('/auth/me');
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data!;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiRequest.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(authData: AuthResponse): void {
    localStorage.setItem('accessToken', authData.tokens.accessToken);
    localStorage.setItem('refreshToken', authData.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  /**
   * Clear authentication data from localStorage
   */
  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export default new AuthService();
