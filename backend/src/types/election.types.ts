import { ElectionStatus, VotingType, Election, Candidate } from '@prisma/client';

export interface CreateElectionDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  votingType: VotingType;
  isAnonymous: boolean;
  candidates: CreateCandidateDTO[];
  settings?: Record<string, any>;
}

export interface CreateCandidateDTO {
  name: string;
  description?: string;
  photo?: string;
  position?: number;
  metadata?: Record<string, any>;
}

export interface UpdateElectionDTO {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ElectionStatus;
  votingType?: VotingType;
  isAnonymous?: boolean;
  settings?: Record<string, any>;
}

export interface VoteDTO {
  candidateId: string;
  rank?: number; // For ranked voting
}

export interface BulkVoteDTO {
  votes: VoteDTO[]; // For multiple choice or ranked voting
}

export interface ElectionResults {
  electionId: string;
  totalVotes: number;
  participationRate: number;
  results: CandidateResult[];
  winnerId?: string;
  election: Election;
}

export interface CandidateResult {
  candidateId: string;
  candidateName: string;
  candidatePhoto?: string;
  voteCount: number;
  percentage: number;
  rank?: number;
}

export interface ElectionStats {
  totalElections: number;
  activeElections: number;
  scheduledElections: number;
  completedElections: number;
}

export interface ElectionWithCandidates extends Election {
  candidates: Candidate[];
  _count?: {
    votes: number;
  };
  hasVoted?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ElectionFilters extends PaginationParams {
  status?: ElectionStatus;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
