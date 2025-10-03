import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { requireRole, isChairman, isSecretaryOrHigher } from '../middleware/roleCheck';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { Role } from '@prisma/client';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Get user statistics
router.get('/stats', userController.getUserStats);

// Get all users (any authenticated user)
router.get('/', userController.getUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user role (Chairman only)
router.put(
  '/:id/role',
  isChairman,
  [
    body('role')
      .isIn([Role.CHAIRMAN, Role.SECRETARY, Role.EXECUTIVE, Role.VOTER])
      .withMessage('Invalid role'),
  ],
  validate,
  userController.updateUserRole
);

// Toggle user status (Chairman or Secretary)
router.put('/:id/status', isSecretaryOrHigher, userController.toggleUserStatus);

// Update user profile (self only)
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name too short'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('phone')
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Invalid phone number'),
  ],
  validate,
  userController.updateProfile
);

// Delete user (Chairman only)
router.delete('/:id', isChairman, userController.deleteUser);

export default router;
