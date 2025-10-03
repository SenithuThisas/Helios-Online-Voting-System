// Vote service - API calls for voting operations

import { apiRequest } from './api';
import { VoteData, BulkVoteData } from '../types/election.types';

export interface Vote {
  id: string;
  electionId: string;
  userId: string;
  candidateId: string;
  rank?: number;
  votedAt: string;
}

export interface MyVote extends Vote {
  election: {
    id: string;
    title: string;
    status: string;
  };
  candidate: {
    id: string;
    name: string;
    photo?: string;
  };
}

class VoteService {
  /**
   * Cast a single vote
   */
  async castVote(electionId: string, candidateId: string, rank?: number): Promise<Vote> {
    const voteData: VoteData = {
      candidateId,
      rank,
    };
    const response = await apiRequest.post<Vote>(`/elections/${electionId}/vote`, voteData);
    return response.data!;
  }

  /**
   * Cast multiple votes (for multiple choice or ranked voting)
   */
  async castBulkVote(electionId: string, votes: VoteData[]): Promise<Vote[]> {
    const bulkVoteData: BulkVoteData = { votes };
    const response = await apiRequest.post<Vote[]>(`/elections/${electionId}/vote/bulk`, bulkVoteData);
    return response.data!;
  }

  /**
   * Check if user has voted in an election
   */
  async checkIfVoted(electionId: string): Promise<boolean> {
    const response = await apiRequest.get<{ hasVoted: boolean }>(`/elections/${electionId}/has-voted`);
    return response.data!.hasVoted;
  }

  /**
   * Get all votes cast by the current user
   */
  async getMyVotes(): Promise<MyVote[]> {
    const response = await apiRequest.get<MyVote[]>('/votes/my-votes');
    return response.data!;
  }

  /**
   * Get user's vote for a specific election
   */
  async getMyVoteForElection(electionId: string): Promise<Vote | null> {
    try {
      const response = await apiRequest.get<Vote>(`/elections/${electionId}/my-vote`);
      return response.data!;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete a vote (if allowed by election settings)
   */
  async deleteVote(electionId: string): Promise<void> {
    await apiRequest.delete(`/elections/${electionId}/vote`);
  }
}

export default new VoteService();
