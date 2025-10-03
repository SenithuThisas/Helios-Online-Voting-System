import { Router } from 'express';
import { ElectionController } from '../controllers/electionController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';
import { validate } from '../middleware/validate';
import {
  createElectionValidator,
  updateElectionValidator,
} from '../validators/electionValidator';
import { Role } from '@prisma/client';

const router = Router();
const electionController = new ElectionController();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/elections
 * Create new election
 * Requires: CHAIRMAN or SECRETARY
 */
router.post(
  '/',
  requireRole(Role.CHAIRMAN, Role.SECRETARY),
  createElectionValidator,
  validate,
  electionController.createElection
);

/**
 * GET /api/elections
 * Get all elections with filters and pagination
 * Accessible to all authenticated users
 */
router.get('/', electionController.getElections);

/**
 * GET /api/elections/:id
 * Get election by ID
 * Accessible to all authenticated users
 */
router.get('/:id', electionController.getElectionById);

/**
 * PUT /api/elections/:id
 * Update election
 * Requires: CHAIRMAN or SECRETARY
 */
router.put(
  '/:id',
  requireRole(Role.CHAIRMAN, Role.SECRETARY),
  updateElectionValidator,
  validate,
  electionController.updateElection
);

/**
 * DELETE /api/elections/:id
 * Delete election
 * Requires: CHAIRMAN
 */
router.delete(
  '/:id',
  requireRole(Role.CHAIRMAN),
  electionController.deleteElection
);

/**
 * POST /api/elections/:id/start
 * Start or schedule election
 * Requires: CHAIRMAN or SECRETARY
 */
router.post(
  '/:id/start',
  requireRole(Role.CHAIRMAN, Role.SECRETARY),
  electionController.startElection
);

/**
 * POST /api/elections/:id/close
 * Close election
 * Requires: CHAIRMAN or SECRETARY
 */
router.post(
  '/:id/close',
  requireRole(Role.CHAIRMAN, Role.SECRETARY),
  electionController.closeElection
);

/**
 * POST /api/elections/:id/publish
 * Publish election results
 * Requires: CHAIRMAN
 */
router.post(
  '/:id/publish',
  requireRole(Role.CHAIRMAN),
  electionController.publishResults
);

/**
 * GET /api/elections/:id/can-vote
 * Check if current user can vote in election
 * Accessible to all authenticated users
 */
router.get('/:id/can-vote', electionController.canVote);

export default router;
