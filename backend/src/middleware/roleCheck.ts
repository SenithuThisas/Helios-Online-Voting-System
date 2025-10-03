import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthorizationError } from '../utils/errors';

/**
 * Type guard to check if user has required role
 */
export const hasRole = (user: any, roles: Role[]): boolean => {
  return user && roles.includes(user.role);
};

/**
 * Middleware to check if user has required role(s)
 */
export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError('Authentication required');
      }

      if (!hasRole(req.user, roles)) {
        throw new AuthorizationError(
          `Access denied. Required role(s): ${roles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user is Chairman
 */
export const isChairman = (req: Request, res: Response, next: NextFunction): void => {
  requireRole(Role.CHAIRMAN)(req, res, next);
};

/**
 * Check if user is Secretary or higher
 */
export const isSecretaryOrHigher = (req: Request, res: Response, next: NextFunction): void => {
  requireRole(Role.CHAIRMAN, Role.SECRETARY)(req, res, next);
};

/**
 * Check if user is Executive or higher
 */
export const isExecutiveOrHigher = (req: Request, res: Response, next: NextFunction): void => {
  requireRole(Role.CHAIRMAN, Role.SECRETARY, Role.EXECUTIVE)(req, res, next);
};

/**
 * Check if user belongs to the same organization
 */
export const sameOrganization = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const { organizationId } = req.params;

    if (organizationId && req.user.organizationId !== organizationId) {
      throw new AuthorizationError('Access denied to this organization');
    }

    next();
  } catch (error) {
    next(error);
  }
};
