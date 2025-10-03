import { Vote, ElectionStatus } from '@prisma/client';
import { prisma } from '../config/database';
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from '../utils/errors';
import { logger } from '../utils/logger';

export interface CastVoteDTO {
  candidateId: string;
  rank?: number;
}

export interface VoteHistory {
  id: string;
  electionId: string;
  electionTitle: string;
  candidateId: string;
  candidateName: string;
  votedAt: Date;
  rank?: number;
}

export class VoteService {
  /**
   * Cast a vote in an election
   */
  async castVote(
    userId: string,
    electionId: string,
    candidateId: string,
    ipAddress?: string,
    userAgent?: string,
    rank?: number
  ): Promise<Vote> {
    // Get election with candidates and user's votes
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        candidates: true,
        votes: {
          where: { userId },
        },
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Check if election is active
    if (election.status !== ElectionStatus.ACTIVE) {
      throw new ValidationError('Election is not active');
    }

    // Check if election dates are valid
    const now = new Date();
    if (now < election.startDate) {
      throw new ValidationError('Election has not started yet');
    }

    if (now > election.endDate) {
      throw new ValidationError('Election has ended');
    }

    // Check if user already voted
    if (election.votes.length > 0) {
      throw new ValidationError('You have already voted in this election');
    }

    // Validate candidate exists and belongs to this election
    const candidate = election.candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      throw new ValidationError('Invalid candidate for this election');
    }

    // Validate rank if provided (for ranked voting)
    if (rank !== undefined && rank < 1) {
      throw new ValidationError('Rank must be a positive integer');
    }

    // Cast the vote
    const vote = await prisma.vote.create({
      data: {
        userId,
        electionId,
        candidateId,
        rank,
        ipAddress,
        userAgent,
      },
      include: {
        candidate: true,
        election: {
          select: {
            title: true,
          },
        },
      },
    });

    logger.info(
      `Vote cast: userId=${userId}, electionId=${electionId}, candidateId=${candidateId}`
    );

    return vote;
  }

  /**
   * Check if user has voted in an election
   */
  async checkIfUserVoted(
    userId: string,
    electionId: string
  ): Promise<{ hasVoted: boolean; vote?: Vote }> {
    const vote = await prisma.vote.findUnique({
      where: {
        electionId_userId: {
          electionId,
          userId,
        },
      },
      include: {
        candidate: true,
        election: {
          select: {
            title: true,
            isAnonymous: true,
          },
        },
      },
    });

    if (vote) {
      return { hasVoted: true, vote };
    }

    return { hasVoted: false };
  }

  /**
   * Get total vote count for an election
   */
  async getVoteCount(electionId: string): Promise<number> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    const count = await prisma.vote.count({
      where: { electionId },
    });

    return count;
  }

  /**
   * Get user's vote history
   */
  async getUserVoteHistory(userId: string): Promise<VoteHistory[]> {
    const votes = await prisma.vote.findMany({
      where: { userId },
      include: {
        election: {
          select: {
            id: true,
            title: true,
            isAnonymous: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        votedAt: 'desc',
      },
    });

    const voteHistory: VoteHistory[] = votes.map((vote) => ({
      id: vote.id,
      electionId: vote.election.id,
      electionTitle: vote.election.title,
      candidateId: vote.candidate.id,
      candidateName: vote.candidate.name,
      votedAt: vote.votedAt,
      rank: vote.rank || undefined,
    }));

    return voteHistory;
  }

  /**
   * Get vote details by vote ID (for admins)
   */
  async getVoteById(voteId: string): Promise<Vote> {
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nic: true,
          },
        },
        candidate: true,
        election: {
          select: {
            id: true,
            title: true,
            isAnonymous: true,
          },
        },
      },
    });

    if (!vote) {
      throw new NotFoundError('Vote not found');
    }

    return vote as any;
  }

  /**
   * Get all votes for an election (for admins, respects anonymity)
   */
  async getElectionVotes(
    electionId: string,
    includeVoterDetails: boolean = false
  ): Promise<Vote[]> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Respect anonymity settings
    const shouldIncludeVoter = includeVoterDetails && !election.isAnonymous;

    const votes = await prisma.vote.findMany({
      where: { electionId },
      include: {
        candidate: true,
        ...(shouldIncludeVoter && {
          user: {
            select: {
              id: true,
              name: true,
              nic: true,
            },
          },
        }),
      },
      orderBy: {
        votedAt: 'desc',
      },
    });

    return votes as any;
  }
}
