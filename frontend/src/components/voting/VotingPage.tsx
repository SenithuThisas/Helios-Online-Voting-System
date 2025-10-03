import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ElectionWithCandidates, VotingType, Candidate, VoteData } from '../../types/election.types';
import { apiRequest } from '../../services/api';
import toast from 'react-hot-toast';
import CandidateCard from './CandidateCard';
import VoteConfirmation from './VoteConfirmation';
import Button from '../shared/Button';
import useElectionStore from '../../store/electionStore';

const VotingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markAsVoted } = useElectionStore();

  const [election, setElection] = useState<ElectionWithCandidates | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (id) {
      fetchElection();
    }
  }, [id]);

  const fetchElection = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get<ElectionWithCandidates>(`/elections/${id}`);
      const electionData = response.data!;

      // Check if user has already voted
      if (electionData.hasVoted) {
        toast.error('You have already voted in this election');
        navigate(`/elections/${id}`);
        return;
      }

      // Check if election is active
      if (electionData.status !== 'ACTIVE') {
        toast.error('This election is not currently active');
        navigate(`/elections/${id}`);
        return;
      }

      setElection(electionData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load election');
      navigate('/elections');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    if (!election) return;

    if (election.votingType === VotingType.SINGLE_CHOICE) {
      setSelectedCandidates([candidate]);
    } else if (election.votingType === VotingType.MULTIPLE_CHOICE) {
      if (selectedCandidates.find(c => c.id === candidate.id)) {
        setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
      } else {
        setSelectedCandidates([...selectedCandidates, candidate]);
      }
    } else if (election.votingType === VotingType.RANKED) {
      // For ranked voting, add to ranked list
      if (!rankedCandidates.find(c => c.id === candidate.id)) {
        setRankedCandidates([...rankedCandidates, candidate]);
      } else {
        setRankedCandidates(rankedCandidates.filter(c => c.id !== candidate.id));
      }
    }
  };

  const handleRankChange = (candidate: Candidate, direction: 'up' | 'down') => {
    const currentIndex = rankedCandidates.findIndex(c => c.id === candidate.id);
    if (currentIndex === -1) return;

    const newRanked = [...rankedCandidates];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < rankedCandidates.length) {
      [newRanked[currentIndex], newRanked[newIndex]] = [newRanked[newIndex], newRanked[currentIndex]];
      setRankedCandidates(newRanked);
    }
  };

  const handleSubmitVote = () => {
    if (!election) return;

    // Validate selection
    if (election.votingType === VotingType.SINGLE_CHOICE && selectedCandidates.length === 0) {
      toast.error('Please select a candidate');
      return;
    }

    if (election.votingType === VotingType.MULTIPLE_CHOICE && selectedCandidates.length === 0) {
      toast.error('Please select at least one candidate');
      return;
    }

    if (election.votingType === VotingType.RANKED && rankedCandidates.length === 0) {
      toast.error('Please rank at least one candidate');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    if (!election) return;

    try {
      setSubmitting(true);

      let votes: VoteData[];

      if (election.votingType === VotingType.SINGLE_CHOICE) {
        votes = [{ candidateId: selectedCandidates[0].id }];
      } else if (election.votingType === VotingType.MULTIPLE_CHOICE) {
        votes = selectedCandidates.map(c => ({ candidateId: c.id }));
      } else {
        // Ranked voting
        votes = rankedCandidates.map((c, index) => ({
          candidateId: c.id,
          rank: index + 1
        }));
      }

      await apiRequest.post(`/votes/${election.id}`, { votes });

      toast.success('Vote submitted successfully!');
      markAsVoted(election.id);
      navigate(`/elections/${election.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit vote');
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!election) {
    return null;
  }

  const isSingleChoice = election.votingType === VotingType.SINGLE_CHOICE;
  const isMultipleChoice = election.votingType === VotingType.MULTIPLE_CHOICE;
  const isRanked = election.votingType === VotingType.RANKED;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl md:text-4xl font-bold">{election.title}</h1>
        <p className="text-blue-100 mt-2">{election.description}</p>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-sm">Voting Type</p>
            <p className="font-semibold">{election.votingType.replace('_', ' ')}</p>
          </div>

          {election.isAnonymous && (
            <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold">Anonymous Voting</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex">
          <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900">How to Vote</h3>
            <p className="text-blue-700 text-sm mt-1">
              {isSingleChoice && 'Select ONE candidate you want to vote for.'}
              {isMultipleChoice && 'Select one or more candidates you want to vote for.'}
              {isRanked && 'Rank the candidates in order of preference. Click to add/remove, then use arrows to reorder.'}
            </p>
          </div>
        </div>
      </div>

      {/* Ranked Candidates Preview (for ranked voting) */}
      {isRanked && rankedCandidates.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Your Rankings</h3>
          <div className="space-y-2">
            {rankedCandidates.map((candidate, index) => (
              <div key={candidate.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium">{candidate.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRankChange(candidate, 'up')}
                    disabled={index === 0}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRankChange(candidate, 'down')}
                    disabled={index === rankedCandidates.length - 1}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {election.candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={
              isRanked
                ? rankedCandidates.some(c => c.id === candidate.id)
                : selectedCandidates.some(c => c.id === candidate.id)
            }
            onSelect={handleCandidateSelect}
            rank={isRanked ? rankedCandidates.findIndex(c => c.id === candidate.id) + 1 : undefined}
            showRank={isRanked && rankedCandidates.some(c => c.id === candidate.id)}
          />
        ))}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-t-lg shadow-lg">
        <div className="flex gap-4">
          <Button
            onClick={() => navigate(`/elections/${election.id}`)}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitVote}
            disabled={
              (isSingleChoice && selectedCandidates.length === 0) ||
              (isMultipleChoice && selectedCandidates.length === 0) ||
              (isRanked && rankedCandidates.length === 0)
            }
            className="flex-1"
          >
            {isSingleChoice && `Vote for ${selectedCandidates[0]?.name || 'Candidate'}`}
            {isMultipleChoice && `Vote for ${selectedCandidates.length} Candidate${selectedCandidates.length !== 1 ? 's' : ''}`}
            {isRanked && `Submit Rankings (${rankedCandidates.length})`}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <VoteConfirmation
            election={election}
            selectedCandidates={isRanked ? rankedCandidates : selectedCandidates}
            isRanked={isRanked}
            onConfirm={confirmVote}
            onCancel={() => setShowConfirmation(false)}
            loading={submitting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VotingPage;
