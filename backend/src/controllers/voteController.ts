import { Request, Response, NextFunction } from 'express';
import { VoteService, CastVoteDTO } from '../services/voteService';
import { sendSuccess } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';

export class VoteController {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  /**
   * Cast a vote in an election
   * POST /api/elections/:electionId/vote
   */
  castVote = asyncHandler(
    async (
      req: Request<{ electionId: string }, {}, CastVoteDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;
      const { candidateId, rank } = req.body;
      const userId = req.user!.id;
      const ipAddress = req.ip;
      const userAgent = req.get('user-agent');

      const vote = await this.voteService.castVote(
        userId,
        electionId,
        candidateId,
        ipAddress,
        userAgent,
        rank
      );

      sendSuccess(res, { vote }, 'Vote cast successfully', 201);
    }
  );

  /**
   * Check if user has voted in an election
   * GET /api/elections/:electionId/my-vote
   */
  hasVoted = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;
      const userId = req.user!.id;

      const result = await this.voteService.checkIfUserVoted(userId, electionId);

      sendSuccess(
        res,
        result,
        result.hasVoted ? 'You have voted in this election' : 'You have not voted yet'
      );
    }
  );

  /**
   * Get user's vote history
   * GET /api/votes/my-votes
   */
  getMyVotes = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const userId = req.user!.id;

      const voteHistory = await this.voteService.getUserVoteHistory(userId);

      sendSuccess(
        res,
        { votes: voteHistory, total: voteHistory.length },
        'Vote history retrieved successfully'
      );
    }
  );

  /**
   * Get vote count for an election
   * GET /api/elections/:electionId/vote-count
   */
  getVoteCount = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;

      const count = await this.voteService.getVoteCount(electionId);

      sendSuccess(res, { count }, 'Vote count retrieved successfully');
    }
  );

  /**
   * Get all votes for an election (admin only)
   * GET /api/elections/:electionId/votes
   */
  getElectionVotes = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;
      const { includeVoterDetails } = req.query;

      const votes = await this.voteService.getElectionVotes(
        electionId,
        includeVoterDetails === 'true'
      );

      sendSuccess(
        res,
        { votes, total: votes.length },
        'Election votes retrieved successfully'
      );
    }
  );
}
