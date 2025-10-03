import { Election, Candidate, ElectionStatus, VotingType, Role } from '@prisma/client';
import { prisma } from '../config/database';
import {
  AppError,
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from '../utils/errors';
import { logger } from '../utils/logger';

export interface CreateElectionDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  votingType: VotingType;
  isAnonymous: boolean;
  candidates: Array<{
    name: string;
    description?: string;
    photo?: string;
    position?: number;
    metadata?: any;
  }>;
  settings?: any;
}

export interface UpdateElectionDTO {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  votingType?: VotingType;
  isAnonymous?: boolean;
  settings?: any;
}

export interface ElectionFilters {
  status?: ElectionStatus;
  organizationId?: string;
  createdById?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class ElectionService {
  /**
   * Create a new election with candidates
   */
  async createElection(
    data: CreateElectionDTO,
    organizationId: string,
    userId: string
  ): Promise<Election & { candidates: Candidate[] }> {
    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate >= endDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new ValidationError('Start date cannot be in the past');
    }

    if (!data.candidates || data.candidates.length < 2) {
      throw new ValidationError('Election must have at least 2 candidates');
    }

    // Create election and candidates in a transaction
    const election = await prisma.$transaction(async (tx) => {
      const newElection = await tx.election.create({
        data: {
          title: data.title,
          description: data.description,
          startDate,
          endDate,
          votingType: data.votingType,
          isAnonymous: data.isAnonymous,
          organizationId,
          createdById: userId,
          status: ElectionStatus.DRAFT,
          settings: data.settings || {},
        },
      });

      // Create candidates
      const candidates = await Promise.all(
        data.candidates.map((candidate, index) =>
          tx.candidate.create({
            data: {
              name: candidate.name,
              description: candidate.description,
              photo: candidate.photo,
              electionId: newElection.id,
              position: candidate.position ?? index,
              metadata: candidate.metadata || {},
            },
          })
        )
      );

      return {
        ...newElection,
        candidates,
      };
    });

    logger.info(`Election created: ${election.id} by user ${userId}`);

    return election;
  }

  /**
   * Update an election
   */
  async updateElection(
    electionId: string,
    data: UpdateElectionDTO,
    userId: string,
    userRole: Role
  ): Promise<Election> {
    // Get existing election
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Check if user can update (must be creator or CHAIRMAN/SECRETARY)
    if (
      election.createdById !== userId &&
      userRole !== Role.CHAIRMAN &&
      userRole !== Role.SECRETARY
    ) {
      throw new AuthorizationError('You do not have permission to update this election');
    }

    // Cannot update ACTIVE, CLOSED, or PUBLISHED elections
    if ([ElectionStatus.ACTIVE, ElectionStatus.CLOSED, ElectionStatus.PUBLISHED].includes(election.status)) {
      throw new ValidationError('Cannot update an active, closed, or published election');
    }

    // Validate dates if provided
    if (data.startDate || data.endDate) {
      const startDate = data.startDate ? new Date(data.startDate) : election.startDate;
      const endDate = data.endDate ? new Date(data.endDate) : election.endDate;

      if (startDate >= endDate) {
        throw new ValidationError('End date must be after start date');
      }

      if (startDate < new Date() && election.status === ElectionStatus.DRAFT) {
        throw new ValidationError('Start date cannot be in the past');
      }
    }

    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.votingType && { votingType: data.votingType }),
        ...(data.isAnonymous !== undefined && { isAnonymous: data.isAnonymous }),
        ...(data.settings && { settings: data.settings }),
      },
    });

    logger.info(`Election updated: ${electionId} by user ${userId}`);

    return updatedElection;
  }

  /**
   * Delete an election
   */
  async deleteElection(
    electionId: string,
    userId: string,
    userRole: Role
  ): Promise<{ message: string }> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { votes: true },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Only CHAIRMAN can delete
    if (userRole !== Role.CHAIRMAN) {
      throw new AuthorizationError('Only CHAIRMAN can delete elections');
    }

    // Cannot delete if votes exist
    if (election.votes.length > 0) {
      throw new ValidationError('Cannot delete an election that has votes');
    }

    // Cannot delete ACTIVE elections
    if (election.status === ElectionStatus.ACTIVE) {
      throw new ValidationError('Cannot delete an active election');
    }

    await prisma.election.delete({
      where: { id: electionId },
    });

    logger.info(`Election deleted: ${electionId} by user ${userId}`);

    return { message: 'Election deleted successfully' };
  }

  /**
   * Get elections with pagination and filters
   */
  async getElections(
    filters: ElectionFilters,
    pagination: PaginationParams
  ): Promise<{ elections: Election[]; total: number; page: number; totalPages: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    if (filters.createdById) {
      where.createdById = filters.createdById;
    }

    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) {
        where.startDate.gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        where.startDate.lte = filters.startDateTo;
      }
    }

    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        skip,
        take: limit,
        include: {
          candidates: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.election.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      elections: elections as any,
      total,
      page,
      totalPages,
    };
  }

  /**
   * Get election by ID
   */
  async getElectionById(
    electionId: string
  ): Promise<Election & { candidates: Candidate[]; _count: any }> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        candidates: {
          orderBy: {
            position: 'asc',
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    return election as any;
  }

  /**
   * Start an election
   */
  async startElection(
    electionId: string,
    userId: string,
    userRole: Role
  ): Promise<Election> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: { candidates: true },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Only CHAIRMAN or SECRETARY can start
    if (userRole !== Role.CHAIRMAN && userRole !== Role.SECRETARY) {
      throw new AuthorizationError('Only CHAIRMAN or SECRETARY can start elections');
    }

    // Must be in DRAFT or SCHEDULED status
    if (![ElectionStatus.DRAFT, ElectionStatus.SCHEDULED].includes(election.status)) {
      throw new ValidationError('Election must be in DRAFT or SCHEDULED status to start');
    }

    // Must have at least 2 candidates
    if (election.candidates.length < 2) {
      throw new ValidationError('Election must have at least 2 candidates to start');
    }

    // Check if start date has passed
    const now = new Date();
    if (election.startDate > now) {
      // Schedule it
      const updatedElection = await prisma.election.update({
        where: { id: electionId },
        data: { status: ElectionStatus.SCHEDULED },
      });

      logger.info(`Election scheduled: ${electionId} by user ${userId}`);
      return updatedElection;
    }

    // Start it
    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: { status: ElectionStatus.ACTIVE },
    });

    logger.info(`Election started: ${electionId} by user ${userId}`);

    return updatedElection;
  }

  /**
   * Close an election
   */
  async closeElection(
    electionId: string,
    userId: string,
    userRole: Role
  ): Promise<Election> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Only CHAIRMAN or SECRETARY can close
    if (userRole !== Role.CHAIRMAN && userRole !== Role.SECRETARY) {
      throw new AuthorizationError('Only CHAIRMAN or SECRETARY can close elections');
    }

    // Must be ACTIVE
    if (election.status !== ElectionStatus.ACTIVE) {
      throw new ValidationError('Only active elections can be closed');
    }

    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: { status: ElectionStatus.CLOSED },
    });

    logger.info(`Election closed: ${electionId} by user ${userId}`);

    return updatedElection;
  }

  /**
   * Publish election results
   */
  async publishResults(
    electionId: string,
    userId: string,
    userRole: Role
  ): Promise<Election> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        votes: true,
        candidates: true,
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Only CHAIRMAN can publish
    if (userRole !== Role.CHAIRMAN) {
      throw new AuthorizationError('Only CHAIRMAN can publish results');
    }

    // Must be CLOSED
    if (election.status !== ElectionStatus.CLOSED) {
      throw new ValidationError('Only closed elections can have results published');
    }

    // Calculate results
    const totalVotes = election.votes.length;
    const candidateVotes: Record<string, number> = {};

    election.candidates.forEach((candidate) => {
      candidateVotes[candidate.id] = 0;
    });

    election.votes.forEach((vote) => {
      candidateVotes[vote.candidateId] = (candidateVotes[vote.candidateId] || 0) + 1;
    });

    const results: Record<string, any> = {};
    let winnerId: string | null = null;
    let maxVotes = 0;

    Object.entries(candidateVotes).forEach(([candidateId, voteCount]) => {
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
      results[candidateId] = {
        voteCount,
        percentage: parseFloat(percentage.toFixed(2)),
      };

      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winnerId = candidateId;
      }
    });

    // Get total eligible voters from organization
    const totalUsers = await prisma.user.count({
      where: {
        organizationId: election.organizationId,
        isActive: true,
      },
    });

    const participationRate = totalUsers > 0 ? (totalVotes / totalUsers) * 100 : 0;

    // Create or update result
    await prisma.result.upsert({
      where: { electionId },
      create: {
        electionId,
        totalVotes,
        participationRate: parseFloat(participationRate.toFixed(2)),
        results,
        winnerId,
      },
      update: {
        totalVotes,
        participationRate: parseFloat(participationRate.toFixed(2)),
        results,
        winnerId,
      },
    });

    // Update election status
    const updatedElection = await prisma.election.update({
      where: { id: electionId },
      data: { status: ElectionStatus.PUBLISHED },
    });

    logger.info(`Election results published: ${electionId} by user ${userId}`);

    return updatedElection;
  }

  /**
   * Check if user can vote in an election
   */
  async checkUserCanVote(
    electionId: string,
    userId: string,
    organizationId: string
  ): Promise<{ canVote: boolean; reason?: string }> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        votes: {
          where: {
            userId,
          },
        },
      },
    });

    if (!election) {
      return { canVote: false, reason: 'Election not found' };
    }

    // Check organization
    if (election.organizationId !== organizationId) {
      return { canVote: false, reason: 'You do not belong to this organization' };
    }

    // Check if election is active
    if (election.status !== ElectionStatus.ACTIVE) {
      return { canVote: false, reason: 'Election is not active' };
    }

    // Check if user already voted
    if (election.votes.length > 0) {
      return { canVote: false, reason: 'You have already voted in this election' };
    }

    // Check dates
    const now = new Date();
    if (now < election.startDate) {
      return { canVote: false, reason: 'Election has not started yet' };
    }

    if (now > election.endDate) {
      return { canVote: false, reason: 'Election has ended' };
    }

    return { canVote: true };
  }
}
