// Zustand election store - Global election state management

import { create } from 'zustand';
import { ElectionWithCandidates, ElectionResults } from '../types/election.types';

interface ElectionState {
  elections: ElectionWithCandidates[];
  activeElections: ElectionWithCandidates[];
  upcomingElections: ElectionWithCandidates[];
  currentElection: ElectionWithCandidates | null;
  electionResults: Record<string, ElectionResults>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setElections: (elections: ElectionWithCandidates[]) => void;
  setActiveElections: (elections: ElectionWithCandidates[]) => void;
  setUpcomingElections: (elections: ElectionWithCandidates[]) => void;
  setCurrentElection: (election: ElectionWithCandidates | null) => void;
  addElection: (election: ElectionWithCandidates) => void;
  updateElection: (id: string, election: ElectionWithCandidates) => void;
  removeElection: (id: string) => void;
  setElectionResults: (electionId: string, results: ElectionResults) => void;
  updateElectionVoteCount: (electionId: string, voteCount: number) => void;
  markAsVoted: (electionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const useElectionStore = create<ElectionState>((set, get) => ({
  elections: [],
  activeElections: [],
  upcomingElections: [],
  currentElection: null,
  electionResults: {},
  isLoading: false,
  error: null,

  /**
   * Set all elections
   */
  setElections: (elections: ElectionWithCandidates[]) => {
    set({ elections, error: null });
  },

  /**
   * Set active elections
   */
  setActiveElections: (elections: ElectionWithCandidates[]) => {
    set({ activeElections: elections });
  },

  /**
   * Set upcoming elections
   */
  setUpcomingElections: (elections: ElectionWithCandidates[]) => {
    set({ upcomingElections: elections });
  },

  /**
   * Set current election being viewed
   */
  setCurrentElection: (election: ElectionWithCandidates | null) => {
    set({ currentElection: election, error: null });
  },

  /**
   * Add a new election to the list
   */
  addElection: (election: ElectionWithCandidates) => {
    set((state) => ({
      elections: [election, ...state.elections],
    }));
  },

  /**
   * Update an existing election
   */
  updateElection: (id: string, updatedElection: ElectionWithCandidates) => {
    set((state) => ({
      elections: state.elections.map((e) => (e.id === id ? updatedElection : e)),
      activeElections: state.activeElections.map((e) => (e.id === id ? updatedElection : e)),
      upcomingElections: state.upcomingElections.map((e) => (e.id === id ? updatedElection : e)),
      currentElection: state.currentElection?.id === id ? updatedElection : state.currentElection,
    }));
  },

  /**
   * Remove an election from the list
   */
  removeElection: (id: string) => {
    set((state) => ({
      elections: state.elections.filter((e) => e.id !== id),
      activeElections: state.activeElections.filter((e) => e.id !== id),
      upcomingElections: state.upcomingElections.filter((e) => e.id !== id),
      currentElection: state.currentElection?.id === id ? null : state.currentElection,
    }));
  },

  /**
   * Set election results
   */
  setElectionResults: (electionId: string, results: ElectionResults) => {
    set((state) => ({
      electionResults: {
        ...state.electionResults,
        [electionId]: results,
      },
    }));
  },

  /**
   * Update election vote count (for real-time updates)
   */
  updateElectionVoteCount: (electionId: string, voteCount: number) => {
    set((state) => ({
      elections: state.elections.map((e) =>
        e.id === electionId
          ? { ...e, _count: { votes: voteCount } }
          : e
      ),
      activeElections: state.activeElections.map((e) =>
        e.id === electionId
          ? { ...e, _count: { votes: voteCount } }
          : e
      ),
      currentElection:
        state.currentElection?.id === electionId
          ? { ...state.currentElection, _count: { votes: voteCount } }
          : state.currentElection,
    }));
  },

  /**
   * Mark election as voted by current user
   */
  markAsVoted: (electionId: string) => {
    set((state) => ({
      elections: state.elections.map((e) =>
        e.id === electionId ? { ...e, hasVoted: true } : e
      ),
      activeElections: state.activeElections.map((e) =>
        e.id === electionId ? { ...e, hasVoted: true } : e
      ),
      currentElection:
        state.currentElection?.id === electionId
          ? { ...state.currentElection, hasVoted: true }
          : state.currentElection,
    }));
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * Set error message
   */
  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set({
      elections: [],
      activeElections: [],
      upcomingElections: [],
      currentElection: null,
      electionResults: {},
      isLoading: false,
      error: null,
    });
  },
}));

export default useElectionStore;
