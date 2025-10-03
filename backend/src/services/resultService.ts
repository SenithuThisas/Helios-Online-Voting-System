import { Result, ElectionStatus, Role } from '@prisma/client';
import { prisma } from '../config/database';
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from '../utils/errors';
import { logger } from '../utils/logger';

export interface CandidateResult {
  candidateId: string;
  candidateName: string;
  voteCount: number;
  percentage: number;
}

export interface ElectionResults {
  electionId: string;
  electionTitle: string;
  status: ElectionStatus;
  totalVotes: number;
  participationRate: number;
  candidates: CandidateResult[];
  winnerId?: string;
  winnerName?: string;
  publishedAt?: Date;
}

export interface ElectionStats {
  totalVotes: number;
  totalEligibleVoters: number;
  participationRate: number;
  votesByCandidate: Record<string, number>;
  votingTrend?: {
    hourly: Record<string, number>;
    daily: Record<string, number>;
  };
}

export class ResultService {
  /**
   * Calculate results for an election
   */
  async calculateResults(electionId: string): Promise<ElectionResults> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        candidates: {
          orderBy: {
            position: 'asc',
          },
        },
        votes: true,
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Calculate total votes
    const totalVotes = election.votes.length;

    // Calculate votes per candidate
    const candidateVotes: Record<string, number> = {};
    election.candidates.forEach((candidate) => {
      candidateVotes[candidate.id] = 0;
    });

    election.votes.forEach((vote) => {
      candidateVotes[vote.candidateId] = (candidateVotes[vote.candidateId] || 0) + 1;
    });

    // Find winner
    let winnerId: string | undefined;
    let maxVotes = 0;

    Object.entries(candidateVotes).forEach(([candidateId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winnerId = candidateId;
      }
    });

    // Calculate participation rate
    const totalEligibleVoters = await prisma.user.count({
      where: {
        organizationId: election.organizationId,
        isActive: true,
      },
    });

    const participationRate =
      totalEligibleVoters > 0 ? (totalVotes / totalEligibleVoters) * 100 : 0;

    // Build candidate results
    const candidateResults: CandidateResult[] = election.candidates.map((candidate) => {
      const voteCount = candidateVotes[candidate.id] || 0;
      const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        voteCount,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    // Sort by vote count (descending)
    candidateResults.sort((a, b) => b.voteCount - a.voteCount);

    const winner = election.candidates.find((c) => c.id === winnerId);

    return {
      electionId: election.id,
      electionTitle: election.title,
      status: election.status,
      totalVotes,
      participationRate: parseFloat(participationRate.toFixed(2)),
      candidates: candidateResults,
      winnerId,
      winnerName: winner?.name,
    };
  }

  /**
   * Get results for an election
   */
  async getResults(electionId: string): Promise<ElectionResults> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        results: true,
        candidates: true,
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // If results are published, return stored results
    if (election.status === ElectionStatus.PUBLISHED && election.results) {
      const result = election.results;
      const resultsData = result.results as Record<
        string,
        { voteCount: number; percentage: number }
      >;

      const candidateResults: CandidateResult[] = election.candidates.map((candidate) => {
        const candidateResult = resultsData[candidate.id] || {
          voteCount: 0,
          percentage: 0,
        };

        return {
          candidateId: candidate.id,
          candidateName: candidate.name,
          voteCount: candidateResult.voteCount,
          percentage: candidateResult.percentage,
        };
      });

      // Sort by vote count (descending)
      candidateResults.sort((a, b) => b.voteCount - a.voteCount);

      const winner = election.candidates.find((c) => c.id === result.winnerId);

      return {
        electionId: election.id,
        electionTitle: election.title,
        status: election.status,
        totalVotes: result.totalVotes,
        participationRate: result.participationRate,
        candidates: candidateResults,
        winnerId: result.winnerId || undefined,
        winnerName: winner?.name,
        publishedAt: result.publishedAt,
      };
    }

    // Otherwise, calculate results on the fly
    return this.calculateResults(electionId);
  }

  /**
   * Publish results - save to database and update election status
   */
  async publishResults(
    electionId: string,
    userId: string,
    userRole: Role
  ): Promise<Result> {
    // Only CHAIRMAN can publish results
    if (userRole !== Role.CHAIRMAN) {
      throw new AuthorizationError('Only CHAIRMAN can publish results');
    }

    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Must be CLOSED to publish
    if (election.status !== ElectionStatus.CLOSED) {
      throw new ValidationError('Only closed elections can have results published');
    }

    // Calculate results
    const calculatedResults = await this.calculateResults(electionId);

    // Build results JSON
    const resultsJson: Record<string, { voteCount: number; percentage: number }> = {};
    calculatedResults.candidates.forEach((candidate) => {
      resultsJson[candidate.candidateId] = {
        voteCount: candidate.voteCount,
        percentage: candidate.percentage,
      };
    });

    // Save results and update election status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Upsert result
      const savedResult = await tx.result.upsert({
        where: { electionId },
        create: {
          electionId,
          totalVotes: calculatedResults.totalVotes,
          participationRate: calculatedResults.participationRate,
          results: resultsJson,
          winnerId: calculatedResults.winnerId || null,
        },
        update: {
          totalVotes: calculatedResults.totalVotes,
          participationRate: calculatedResults.participationRate,
          results: resultsJson,
          winnerId: calculatedResults.winnerId || null,
        },
      });

      // Update election status to PUBLISHED
      await tx.election.update({
        where: { id: electionId },
        data: { status: ElectionStatus.PUBLISHED },
      });

      return savedResult;
    });

    logger.info(`Results published for election: ${electionId} by user ${userId}`);

    return result;
  }

  /**
   * Get results for voter - only if published
   */
  async getResultsForVoter(
    electionId: string,
    userId: string
  ): Promise<ElectionResults> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        results: true,
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    // Only show results if published
    if (election.status !== ElectionStatus.PUBLISHED) {
      throw new ValidationError('Results are not yet published');
    }

    return this.getResults(electionId);
  }

  /**
   * Get detailed statistics for an election
   */
  async getStats(electionId: string): Promise<ElectionStats> {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        votes: {
          orderBy: {
            votedAt: 'asc',
          },
        },
        candidates: true,
      },
    });

    if (!election) {
      throw new NotFoundError('Election not found');
    }

    const totalVotes = election.votes.length;

    // Get total eligible voters
    const totalEligibleVoters = await prisma.user.count({
      where: {
        organizationId: election.organizationId,
        isActive: true,
      },
    });

    const participationRate =
      totalEligibleVoters > 0 ? (totalVotes / totalEligibleVoters) * 100 : 0;

    // Calculate votes by candidate
    const votesByCandidate: Record<string, number> = {};
    election.candidates.forEach((candidate) => {
      votesByCandidate[candidate.id] = 0;
    });

    election.votes.forEach((vote) => {
      votesByCandidate[vote.candidateId] = (votesByCandidate[vote.candidateId] || 0) + 1;
    });

    // Calculate voting trend (hourly and daily)
    const hourly: Record<string, number> = {};
    const daily: Record<string, number> = {};

    election.votes.forEach((vote) => {
      const votedAt = new Date(vote.votedAt);

      // Hourly trend
      const hourKey = votedAt.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      hourly[hourKey] = (hourly[hourKey] || 0) + 1;

      // Daily trend
      const dayKey = votedAt.toISOString().slice(0, 10); // YYYY-MM-DD
      daily[dayKey] = (daily[dayKey] || 0) + 1;
    });

    return {
      totalVotes,
      totalEligibleVoters,
      participationRate: parseFloat(participationRate.toFixed(2)),
      votesByCandidate,
      votingTrend: {
        hourly,
        daily,
      },
    };
  }
}
