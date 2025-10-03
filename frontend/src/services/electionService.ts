// Election service - API calls for election operations

import { apiRequest } from './api';
import {
  Election,
  ElectionWithCandidates,
  CreateElectionData,
  UpdateElectionData,
  ElectionResults,
  ElectionFilters,
  ElectionStats,
} from '../types/election.types';
import { PaginatedResponse } from '../types/api.types';

class ElectionService {
  /**
   * Get all elections with optional filters and pagination
   */
  async getElections(filters?: ElectionFilters): Promise<PaginatedResponse<ElectionWithCandidates>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.startDate) params.append('startDate', filters.startDate.toString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toString());

    const queryString = params.toString();
    const url = queryString ? `/elections?${queryString}` : '/elections';

    const response = await apiRequest.get<PaginatedResponse<ElectionWithCandidates>>(url);
    return response.data!;
  }

  /**
   * Get election by ID
   */
  async getElectionById(id: string): Promise<ElectionWithCandidates> {
    const response = await apiRequest.get<ElectionWithCandidates>(`/elections/${id}`);
    return response.data!;
  }

  /**
   * Create a new election
   */
  async createElection(data: CreateElectionData): Promise<ElectionWithCandidates> {
    const response = await apiRequest.post<ElectionWithCandidates>('/elections', data);
    return response.data!;
  }

  /**
   * Update an election
   */
  async updateElection(id: string, data: UpdateElectionData): Promise<ElectionWithCandidates> {
    const response = await apiRequest.put<ElectionWithCandidates>(`/elections/${id}`, data);
    return response.data!;
  }

  /**
   * Delete an election
   */
  async deleteElection(id: string): Promise<void> {
    await apiRequest.delete(`/elections/${id}`);
  }

  /**
   * Start an election (change status to ACTIVE)
   */
  async startElection(id: string): Promise<ElectionWithCandidates> {
    const response = await apiRequest.post<ElectionWithCandidates>(`/elections/${id}/start`);
    return response.data!;
  }

  /**
   * Close an election (change status to CLOSED)
   */
  async closeElection(id: string): Promise<ElectionWithCandidates> {
    const response = await apiRequest.post<ElectionWithCandidates>(`/elections/${id}/close`);
    return response.data!;
  }

  /**
   * Get election results
   */
  async getElectionResults(id: string): Promise<ElectionResults> {
    const response = await apiRequest.get<ElectionResults>(`/elections/${id}/results`);
    return response.data!;
  }

  /**
   * Publish election results
   */
  async publishResults(id: string): Promise<ElectionResults> {
    const response = await apiRequest.post<ElectionResults>(`/elections/${id}/publish`);
    return response.data!;
  }

  /**
   * Get active elections
   */
  async getActiveElections(): Promise<ElectionWithCandidates[]> {
    const response = await apiRequest.get<ElectionWithCandidates[]>('/elections/active');
    return response.data!;
  }

  /**
   * Get upcoming elections
   */
  async getUpcomingElections(): Promise<ElectionWithCandidates[]> {
    const response = await apiRequest.get<ElectionWithCandidates[]>('/elections/upcoming');
    return response.data!;
  }

  /**
   * Get election statistics
   */
  async getElectionStats(): Promise<ElectionStats> {
    const response = await apiRequest.get<ElectionStats>('/elections/stats');
    return response.data!;
  }

  /**
   * Check if user has voted in an election
   */
  async hasUserVoted(electionId: string): Promise<boolean> {
    const response = await apiRequest.get<{ hasVoted: boolean }>(`/elections/${electionId}/has-voted`);
    return response.data!.hasVoted;
  }
}

export default new ElectionService();
