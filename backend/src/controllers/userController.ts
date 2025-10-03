import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { sendSuccess, sendPaginatedResponse } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';
import { Role } from '@prisma/client';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users
   * GET /api/users
   */
  getUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const organizationId = req.user?.organizationId || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const result = await this.userService.getUsers(organizationId, page, limit, search);

      res.status(200).json(result);
    }
  );

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  getUserById = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      sendSuccess(res, { user }, 'User retrieved successfully');
    }
  );

  /**
   * Update user role
   * PUT /api/users/:id/role
   */
  updateUserRole = asyncHandler(
    async (
      req: Request<{ id: string }, {}, { role: Role }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const { role } = req.body;
      const requestingUserId = req.user?.id || '';

      const user = await this.userService.updateUserRole(id, role, requestingUserId);

      sendSuccess(res, { user }, 'User role updated successfully');
    }
  );

  /**
   * Toggle user status
   * PUT /api/users/:id/status
   */
  toggleUserStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const requestingUserId = req.user?.id || '';

      const user = await this.userService.toggleUserStatus(id, requestingUserId);

      sendSuccess(res, { user }, 'User status updated successfully');
    }
  );

  /**
   * Update user profile
   * PUT /api/users/:id
   */
  updateProfile = asyncHandler(
    async (
      req: Request<{ id: string }, {}, { name?: string; email?: string; phone?: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user?.id;

      // Users can only update their own profile
      if (userId !== id) {
        res.status(403).json({
          success: false,
          message: 'You can only update your own profile',
        });
        return;
      }

      const user = await this.userService.updateProfile(id, req.body);

      sendSuccess(res, { user }, 'Profile updated successfully');
    }
  );

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  deleteUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const requestingUserId = req.user?.id || '';

      await this.userService.deleteUser(id, requestingUserId);

      sendSuccess(res, {}, 'User deleted successfully');
    }
  );

  /**
   * Get user statistics
   * GET /api/users/stats
   */
  getUserStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const organizationId = req.user?.organizationId || '';

      const stats = await this.userService.getUserStats(organizationId);

      sendSuccess(res, stats, 'User statistics retrieved successfully');
    }
  );
}
