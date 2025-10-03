import React from 'react';
import { motion } from 'framer-motion';
import { Candidate } from '../../types/election.types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect?: (candidate: Candidate) => void;
  disabled?: boolean;
  rank?: number;
  showRank?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected = false,
  onSelect,
  disabled = false,
  rank,
  showRank = false
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(candidate);
    }
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      className={`
        relative rounded-lg border-2 p-6 transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-blue-500 rounded-full p-1"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      {/* Rank Badge */}
      {showRank && rank && (
        <div className="absolute top-4 left-4 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {rank}
        </div>
      )}

      {/* Candidate Photo/Avatar */}
      <div className="flex justify-center mb-4">
        {candidate.photo ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={candidate.photo}
            alt={candidate.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        )}
      </div>

      {/* Candidate Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{candidate.name}</h3>

        {candidate.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {candidate.description}
          </p>
        )}

        {/* Additional Metadata */}
        {candidate.metadata && Object.keys(candidate.metadata).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {Object.entries(candidate.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selection Hint */}
      {!disabled && !isSelected && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Click to select
        </div>
      )}

      {isSelected && (
        <div className="mt-4 text-center text-sm font-semibold text-blue-600">
          Selected
        </div>
      )}
    </motion.div>
  );
};

export default CandidateCard;
