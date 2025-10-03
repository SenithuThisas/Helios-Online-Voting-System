import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginDTO, RegisterDTO } from '../types/auth.types';
import { sendSuccess } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user and organization
   * POST /api/auth/register
   */
  register = asyncHandler(
    async (
      req: Request<{}, {}, RegisterDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const data = req.body;
      const result = await this.authService.register(data);

      sendSuccess(res, result, 'Registration successful', 201);
    }
  );

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(
    async (
      req: Request<{}, {}, LoginDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { nic, password } = req.body;
      const result = await this.authService.login(nic, password);

      sendSuccess(res, result, 'Login successful');
    }
  );

  /**
   * Request OTP
   * POST /api/auth/send-otp
   */
  requestOTP = asyncHandler(
    async (
      req: Request<{}, {}, { phone: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { phone } = req.body;
      const result = await this.authService.requestOTP(phone);

      sendSuccess(res, result, 'OTP sent successfully');
    }
  );

  /**
   * Verify OTP
   * POST /api/auth/verify-otp
   */
  verifyOTP = asyncHandler(
    async (
      req: Request<{}, {}, { phone: string; code: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { phone, code } = req.body;
      const result = await this.authService.verifyOTP(phone, code);

      sendSuccess(res, result, 'OTP verified successfully');
    }
  );

  /**
   * Refresh access token
   * POST /api/auth/refresh-token
   */
  refreshToken = asyncHandler(
    async (
      req: Request<{}, {}, { refreshToken: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);

      sendSuccess(res, { tokens }, 'Token refreshed successfully');
    }
  );

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(
    async (
      req: Request<{}, {}, { refreshToken?: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const userId = req.user?.id;
      const { refreshToken } = req.body;

      if (!userId) {
        sendSuccess(res, {}, 'Logged out successfully');
        return;
      }

      const result = await this.authService.logout(userId, refreshToken);

      sendSuccess(res, result, 'Logged out successfully');
    }
  );

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const user = await this.authService.getCurrentUser(userId);

      sendSuccess(res, { user }, 'User retrieved successfully');
    }
  );
}
