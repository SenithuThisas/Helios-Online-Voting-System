import { User, Role } from '@prisma/client';
import { prisma } from '../config/database';
import { redis, redisHelper } from '../config/redis';
import {
  LoginDTO,
  RegisterDTO,
  AuthTokens,
  RequestOTPDTO,
  VerifyOTPDTO,
} from '../types/auth.types';
import { hashPassword, comparePassword, generateOTP } from '../utils/encryption';
import { generateTokens } from '../utils/jwt';
import {
  AppError,
  AuthenticationError,
  ConflictError,
  ValidationError,
} from '../utils/errors';
import { sanitizeUser } from '../utils/helpers';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class AuthService {
  /**
   * Register a new user and organization
   */
  async register(data: RegisterDTO): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { nic: data.nic },
    });

    if (existingUser) {
      throw new ConflictError('User with this NIC already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Generate subdomain from organization name
    const subdomain = data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if subdomain is taken
    const existingOrg = await prisma.organization.findUnique({
      where: { subdomain },
    });

    if (existingOrg) {
      throw new ConflictError('Organization name is already taken');
    }

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          subdomain,
        },
      });

      const user = await tx.user.create({
        data: {
          nic: data.nic,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          email: data.email,
          role: Role.CHAIRMAN, // First user becomes Chairman
          organizationId: organization.id,
        },
      });

      return { user, organization };
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: result.user.id,
      organizationId: result.user.organizationId,
      role: result.user.role,
    });

    // Store refresh token in Redis
    await redisHelper.set(
      `refresh_token:${result.user.id}`,
      tokens.refreshToken,
      30 * 24 * 60 * 60 // 30 days
    );

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: result.user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info(`New user registered: ${result.user.nic}`);

    return {
      user: sanitizeUser(result.user),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(nic: string, password: string): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { nic },
      include: { organization: true },
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Your account has been deactivated');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
    });

    // Store refresh token
    await redisHelper.set(
      `refresh_token:${user.id}`,
      tokens.refreshToken,
      30 * 24 * 60 * 60
    );

    // Save refresh token to database
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.info(`User logged in: ${user.nic}`);

    return {
      user: sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Request OTP
   */
  async requestOTP(phone: string): Promise<{ message: string }> {
    // Check if user exists with this phone
    const user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      throw new ValidationError('No user found with this phone number');
    }

    // Generate OTP
    const code = generateOTP();

    // Store OTP in database
    await prisma.oTP.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + config.OTP_EXPIRY_MINUTES * 60 * 1000),
      },
    });

    // In production, send OTP via SMS (Twilio, etc.)
    // For MVP, log to console
    if (config.NODE_ENV === 'development') {
      logger.info(`🔐 OTP for ${phone}: ${code}`);
      console.log(`\n🔐 OTP for ${phone}: ${code}\n`);
    } else {
      // TODO: Implement SMS sending via Twilio
      logger.info(`OTP sent to ${phone}`);
    }

    return {
      message: 'OTP sent successfully',
    };
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phone: string, code: string): Promise<{ verified: boolean }> {
    // Find the latest OTP for this phone
    const otp = await prisma.oTP.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otp) {
      // Increment attempts
      await prisma.oTP.updateMany({
        where: {
          phone,
          code,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      throw new ValidationError('Invalid or expired OTP');
    }

    // Check attempts
    if (otp.attempts >= 3) {
      throw new ValidationError('Too many failed attempts. Please request a new OTP.');
    }

    // Mark as verified
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    logger.info(`OTP verified for ${phone}`);

    return { verified: true };
  }

  /**
   * Logout user
   */
  async logout(userId: string, refreshToken?: string): Promise<{ message: string }> {
    // Remove refresh token from Redis
    await redisHelper.delete(`refresh_token:${userId}`);

    // Remove refresh token from database
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId,
        },
      });
    }

    logger.info(`User logged out: ${userId}`);

    return { message: 'Logged out successfully' };
  }

  /**
   * Refresh access token
   */
  async refreshToken(oldRefreshToken: string): Promise<AuthTokens> {
    // Verify refresh token exists in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if expired
    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new AuthenticationError('Refresh token expired');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: tokenRecord.userId,
      organizationId: tokenRecord.user.organizationId,
      role: tokenRecord.user.role,
    });

    // Store new refresh token
    await redisHelper.set(
      `refresh_token:${tokenRecord.userId}`,
      tokens.refreshToken,
      30 * 24 * 60 * 60
    );

    // Delete old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      }),
      prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: tokenRecord.userId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return tokens;
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return sanitizeUser(user);
  }
}
