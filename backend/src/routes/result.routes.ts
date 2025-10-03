import { Router } from 'express';
import { ResultController } from '../controllers/resultController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';
import { validate } from '../middleware/validate';
import { electionIdValidator } from '../validators/voteValidator';
import { Role } from '@prisma/client';

const router = Router();
const resultController = new ResultController();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/elections/:electionId/results
 * Get results for an election
 * - Admins can see results anytime
 * - Regular users can only see published results
 * Accessible to all authenticated users
 */
router.get(
  '/elections/:electionId/results',
  electionIdValidator,
  validate,
  resultController.getResults
);

/**
 * POST /api/elections/:electionId/results/calculate
 * Calculate and publish results for an election
 * Requires: CHAIRMAN
 */
router.post(
  '/elections/:electionId/results/calculate',
  requireRole(Role.CHAIRMAN),
  electionIdValidator,
  validate,
  resultController.calculateAndSave
);

/**
 * GET /api/elections/:electionId/results/preview
 * Preview results without publishing (admin only)
 * Requires: CHAIRMAN, SECRETARY, or EXECUTIVE
 */
router.get(
  '/elections/:electionId/results/preview',
  requireRole(Role.CHAIRMAN, Role.SECRETARY, Role.EXECUTIVE),
  electionIdValidator,
  validate,
  resultController.previewResults
);

/**
 * GET /api/elections/:electionId/stats
 * Get detailed statistics for an election
 * Requires: CHAIRMAN, SECRETARY, or EXECUTIVE
 */
router.get(
  '/elections/:electionId/stats',
  requireRole(Role.CHAIRMAN, Role.SECRETARY, Role.EXECUTIVE),
  electionIdValidator,
  validate,
  resultController.getStats
);

export default router;
