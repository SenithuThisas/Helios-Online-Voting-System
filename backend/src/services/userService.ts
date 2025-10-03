import { User, Role } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/encryption';
import { NotFoundError, ConflictError, AuthorizationError } from '../utils/errors';
import { sanitizeUser, getPaginationParams } from '../utils/helpers';
import { PaginatedResponse } from '../types';

export class UserService {
  /**
   * Get all users for an organization
   */
  async getUsers(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<PaginatedResponse<Omit<User, 'password'>>> {
    const { skip, take } = getPaginationParams(page, limit);

    const where: any = { organizationId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nic: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const sanitizedUsers = users.map((user) => sanitizeUser(user));

    return {
      data: sanitizedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return sanitizeUser(user);
  }

  /**
   * Update user role (Chairman only)
   */
  async updateUserRole(
    userId: string,
    newRole: Role,
    requestingUserId: string
  ): Promise<Omit<User, 'password'>> {
    // Get requesting user
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.role !== Role.CHAIRMAN) {
      throw new AuthorizationError('Only Chairman can change roles');
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    // Check same organization
    if (targetUser.organizationId !== requestingUser.organizationId) {
      throw new AuthorizationError('Cannot modify users from different organization');
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return sanitizeUser(updatedUser);
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(
    userId: string,
    requestingUserId: string
  ): Promise<Omit<User, 'password'>> {
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (
      !requestingUser ||
      (requestingUser.role !== Role.CHAIRMAN && requestingUser.role !== Role.SECRETARY)
    ) {
      throw new AuthorizationError('Only Chairman or Secretary can change user status');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    if (targetUser.organizationId !== requestingUser.organizationId) {
      throw new AuthorizationError('Cannot modify users from different organization');
    }

    // Cannot deactivate yourself
    if (targetUser.id === requestingUser.id) {
      throw new AuthorizationError('Cannot deactivate your own account');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !targetUser.isActive },
    });

    return sanitizeUser(updatedUser);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name || user.name,
        email: data.email || user.email,
        phone: data.phone || user.phone,
      },
    });

    return sanitizeUser(updatedUser);
  }

  /**
   * Delete user (Chairman only)
   */
  async deleteUser(userId: string, requestingUserId: string): Promise<void> {
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
    });

    if (!requestingUser || requestingUser.role !== Role.CHAIRMAN) {
      throw new AuthorizationError('Only Chairman can delete users');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundError('User not found');
    }

    if (targetUser.organizationId !== requestingUser.organizationId) {
      throw new AuthorizationError('Cannot delete users from different organization');
    }

    if (targetUser.id === requestingUser.id) {
      throw new AuthorizationError('Cannot delete your own account');
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats(organizationId: string): Promise<{
    total: number;
    byRole: Record<Role, number>;
    active: number;
    inactive: number;
  }> {
    const [total, active, inactive, byRole] = await Promise.all([
      prisma.user.count({ where: { organizationId } }),
      prisma.user.count({ where: { organizationId, isActive: true } }),
      prisma.user.count({ where: { organizationId, isActive: false } }),
      prisma.user.groupBy({
        by: ['role'],
        where: { organizationId },
        _count: { role: true },
      }),
    ]);

    const roleStats = {
      [Role.CHAIRMAN]: 0,
      [Role.SECRETARY]: 0,
      [Role.EXECUTIVE]: 0,
      [Role.VOTER]: 0,
    };

    byRole.forEach((item) => {
      roleStats[item.role] = item._count.role;
    });

    return {
      total,
      byRole: roleStats,
      active,
      inactive,
    };
  }
}
