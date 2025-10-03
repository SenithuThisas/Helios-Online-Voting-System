import React from 'react';
import { motion } from 'framer-motion';
import { ElectionWithCandidates, Candidate } from '../../types/election.types';
import Button from '../shared/Button';
import Modal from '../shared/Modal';

interface VoteConfirmationProps {
  election: ElectionWithCandidates;
  selectedCandidates: Candidate[];
  isRanked?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const VoteConfirmation: React.FC<VoteConfirmationProps> = ({
  election,
  selectedCandidates,
  isRanked = false,
  onConfirm,
  onCancel,
  loading = false
}) => {
  return (
    <Modal onClose={onCancel}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Confirm Your Vote
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Please review your selection before submitting. This action cannot be undone.
        </p>

        {/* Election Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">{election.title}</h3>
          <p className="text-sm text-gray-600">{election.description}</p>
        </div>

        {/* Selected Candidates */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            {isRanked ? 'Your Rankings:' : 'Your Selection:'}
          </h3>

          <div className="space-y-2">
            {selectedCandidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center bg-blue-50 rounded-lg p-3"
              >
                {isRanked && (
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                )}

                {candidate.photo ? (
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium text-gray-800">{candidate.name}</p>
                  {candidate.description && (
                    <p className="text-xs text-gray-600 line-clamp-1">{candidate.description}</p>
                  )}
                </div>

                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {election.isAnonymous && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm text-yellow-800 font-medium">Anonymous Voting</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your vote is anonymous and cannot be traced back to you.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-red-800 font-medium">Important</p>
              <p className="text-xs text-red-700 mt-1">
                Once submitted, your vote cannot be changed or cancelled. Make sure your selection is correct.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={loading}
          >
            Review
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            Confirm & Submit
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default VoteConfirmation;
