// Election-related TypeScript types matching backend API

export enum ElectionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  PUBLISHED = 'PUBLISHED',
}

export enum VotingType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  RANKED = 'RANKED',
}

export interface Candidate {
  id: string;
  name: string;
  description?: string;
  photo?: string;
  electionId: string;
  position: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ElectionStatus;
  votingType: VotingType;
  isAnonymous: boolean;
  organizationId: string;
  createdById: string;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ElectionWithCandidates extends Election {
  candidates: Candidate[];
  _count?: {
    votes: number;
  };
  hasVoted?: boolean;
}

export interface CreateCandidateData {
  name: string;
  description?: string;
  photo?: string;
  position?: number;
  metadata?: Record<string, any>;
}

export interface CreateElectionData {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  votingType: VotingType;
  isAnonymous: boolean;
  candidates: CreateCandidateData[];
  settings?: Record<string, any>;
}

export interface UpdateElectionData {
  title?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: ElectionStatus;
  votingType?: VotingType;
  isAnonymous?: boolean;
  settings?: Record<string, any>;
}

export interface VoteData {
  candidateId: string;
  rank?: number;
}

export interface BulkVoteData {
  votes: VoteData[];
}

export interface CandidateResult {
  candidateId: string;
  candidateName: string;
  candidatePhoto?: string;
  voteCount: number;
  percentage: number;
  rank?: number;
}

export interface ElectionResults {
  electionId: string;
  totalVotes: number;
  participationRate: number;
  results: CandidateResult[];
  winnerId?: string;
  election: Election;
}

export interface ElectionStats {
  totalElections: number;
  activeElections: number;
  scheduledElections: number;
  completedElections: number;
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
  startDate?: Date | string;
  endDate?: Date | string;
}
