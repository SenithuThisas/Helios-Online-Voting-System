import { Request, Response, NextFunction } from 'express';
import { ResultService } from '../services/resultService';
import { sendSuccess } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';

export class ResultController {
  private resultService: ResultService;

  constructor() {
    this.resultService = new ResultService();
  }

  /**
   * Get results for an election
   * GET /api/elections/:electionId/results
   */
  getResults = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      // Check if user is admin (CHAIRMAN, SECRETARY, EXECUTIVE)
      const isAdmin = ['CHAIRMAN', 'SECRETARY', 'EXECUTIVE'].includes(userRole);

      let results;
      if (isAdmin) {
        // Admins can see results anytime
        results = await this.resultService.getResults(electionId);
      } else {
        // Regular voters can only see published results
        results = await this.resultService.getResultsForVoter(electionId, userId);
      }

      sendSuccess(res, { results }, 'Results retrieved successfully');
    }
  );

  /**
   * Calculate and save results (publish)
   * POST /api/elections/:electionId/results/calculate
   */
  calculateAndSave = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const result = await this.resultService.publishResults(
        electionId,
        userId,
        userRole
      );

      sendSuccess(res, { result }, 'Results published successfully', 201);
    }
  );

  /**
   * Get election statistics
   * GET /api/elections/:electionId/stats
   */
  getStats = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;

      const stats = await this.resultService.getStats(electionId);

      sendSuccess(res, { stats }, 'Statistics retrieved successfully');
    }
  );

  /**
   * Calculate results without saving (preview)
   * GET /api/elections/:electionId/results/preview
   */
  previewResults = asyncHandler(
    async (
      req: Request<{ electionId: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { electionId } = req.params;

      const results = await this.resultService.calculateResults(electionId);

      sendSuccess(res, { results }, 'Results preview generated successfully');
    }
  );
}
