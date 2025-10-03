import { Request, Response, NextFunction } from 'express';
import { ElectionService, CreateElectionDTO, UpdateElectionDTO } from '../services/electionService';
import { sendSuccess } from '../utils/helpers';
import { asyncHandler } from '../middleware/errorHandler';
import { ElectionStatus } from '@prisma/client';

export class ElectionController {
  private electionService: ElectionService;

  constructor() {
    this.electionService = new ElectionService();
  }

  /**
   * Create new election
   * POST /api/elections
   */
  createElection = asyncHandler(
    async (
      req: Request<{}, {}, CreateElectionDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const data = req.body;
      const organizationId = req.user!.organizationId;
      const userId = req.user!.id;

      const election = await this.electionService.createElection(
        data,
        organizationId,
        userId
      );

      sendSuccess(res, { election }, 'Election created successfully', 201);
    }
  );

  /**
   * Update election
   * PUT /api/elections/:id
   */
  updateElection = asyncHandler(
    async (
      req: Request<{ id: string }, {}, UpdateElectionDTO>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const data = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const election = await this.electionService.updateElection(
        id,
        data,
        userId,
        userRole
      );

      sendSuccess(res, { election }, 'Election updated successfully');
    }
  );

  /**
   * Delete election
   * DELETE /api/elections/:id
   */
  deleteElection = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const result = await this.electionService.deleteElection(id, userId, userRole);

      sendSuccess(res, result, result.message);
    }
  );

  /**
   * Get all elections with filters and pagination
   * GET /api/elections
   */
  getElections = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const organizationId = req.user!.organizationId;
      const { status, createdById, startDateFrom, startDateTo, page, limit } = req.query;

      const filters = {
        organizationId,
        ...(status && { status: status as ElectionStatus }),
        ...(createdById && { createdById: createdById as string }),
        ...(startDateFrom && { startDateFrom: new Date(startDateFrom as string) }),
        ...(startDateTo && { startDateTo: new Date(startDateTo as string) }),
      };

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.electionService.getElections(filters, pagination);

      sendSuccess(res, result, 'Elections retrieved successfully');
    }
  );

  /**
   * Get election by ID
   * GET /api/elections/:id
   */
  getElectionById = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;

      const election = await this.electionService.getElectionById(id);

      sendSuccess(res, { election }, 'Election retrieved successfully');
    }
  );

  /**
   * Start election
   * POST /api/elections/:id/start
   */
  startElection = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const election = await this.electionService.startElection(id, userId, userRole);

      sendSuccess(
        res,
        { election },
        election.status === ElectionStatus.SCHEDULED
          ? 'Election scheduled successfully'
          : 'Election started successfully'
      );
    }
  );

  /**
   * Close election
   * POST /api/elections/:id/close
   */
  closeElection = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const election = await this.electionService.closeElection(id, userId, userRole);

      sendSuccess(res, { election }, 'Election closed successfully');
    }
  );

  /**
   * Publish election results
   * POST /api/elections/:id/publish
   */
  publishResults = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const election = await this.electionService.publishResults(id, userId, userRole);

      sendSuccess(res, { election }, 'Election results published successfully');
    }
  );

  /**
   * Check if user can vote
   * GET /api/elections/:id/can-vote
   */
  canVote = asyncHandler(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.user!.id;
      const organizationId = req.user!.organizationId;

      const result = await this.electionService.checkUserCanVote(
        id,
        userId,
        organizationId
      );

      sendSuccess(res, result, result.canVote ? 'You can vote' : result.reason || '');
    }
  );
}
