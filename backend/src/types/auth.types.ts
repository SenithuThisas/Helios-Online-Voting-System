import { User, Role } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  organizationId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDTO {
  nic: string;
  password: string;
}

export interface RegisterDTO {
  nic: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
  organizationName: string;
}

export interface VerifyOTPDTO {
  phone: string;
  code: string;
}

export interface RequestOTPDTO {
  phone: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
