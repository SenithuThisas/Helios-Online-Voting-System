import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter';
import {
  registerValidator,
  loginValidator,
  requestOTPValidator,
  verifyOTPValidator,
  refreshTokenValidator,
} from '../validators/authValidator';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/register',
  authLimiter,
  registerValidator,
  validate,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  loginValidator,
  validate,
  authController.login
);

router.post(
  '/send-otp',
  otpLimiter,
  requestOTPValidator,
  validate,
  authController.requestOTP
);

router.post(
  '/verify-otp',
  otpLimiter,
  verifyOTPValidator,
  validate,
  authController.verifyOTP
);

router.post(
  '/refresh-token',
  refreshTokenValidator,
  validate,
  authController.refreshToken
);

// Protected routes
router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, authController.getCurrentUser);

export default router;
