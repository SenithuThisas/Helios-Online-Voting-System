// Auth-related TypeScript types matching backend API

export enum UserRole {
  CHAIRMAN = 'CHAIRMAN',
  SECRETARY = 'SECRETARY',
  EXECUTIVE = 'EXECUTIVE',
  VOTER = 'VOTER',
}

export interface User {
  id: string;
  nic: string;
  email?: string;
  phone: string;
  name: string;
  role: UserRole;
  organizationId: string;
  customFields?: Record<string, any>;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  nic: string;
  password: string;
}

export interface RegisterData {
  nic: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
  organizationName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface OTPRequest {
  phone: string;
}

export interface OTPVerify {
  phone: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
