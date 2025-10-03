import { Router } from 'express';
import { VoteController } from '../controllers/voteController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';
import { validate } from '../middleware/validate';
import { castVoteValidator, electionIdValidator } from '../validators/voteValidator';
import { Role } from '@prisma/client';

const router = Router();
const voteController = new VoteController();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/elections/:electionId/vote
 * Cast a vote in an election
 * Accessible to all authenticated users
 */
router.post(
  '/elections/:electionId/vote',
  castVoteValidator,
  validate,
  voteController.castVote
);

/**
 * GET /api/elections/:electionId/my-vote
 * Check if current user has voted in an election
 * Accessible to all authenticated users
 */
router.get(
  '/elections/:electionId/my-vote',
  electionIdValidator,
  validate,
  voteController.hasVoted
);

/**
 * GET /api/votes/my-votes
 * Get current user's vote history
 * Accessible to all authenticated users
 */
router.get('/my-votes', voteController.getMyVotes);

/**
 * GET /api/elections/:electionId/vote-count
 * Get total vote count for an election
 * Accessible to all authenticated users
 */
router.get(
  '/elections/:electionId/vote-count',
  electionIdValidator,
  validate,
  voteController.getVoteCount
);

/**
 * GET /api/elections/:electionId/votes
 * Get all votes for an election (admin only)
 * Requires: CHAIRMAN, SECRETARY, or EXECUTIVE
 */
router.get(
  '/elections/:electionId/votes',
  requireRole(Role.CHAIRMAN, Role.SECRETARY, Role.EXECUTIVE),
  electionIdValidator,
  validate,
  voteController.getElectionVotes
);

export default router;
