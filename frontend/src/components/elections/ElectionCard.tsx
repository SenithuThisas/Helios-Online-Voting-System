import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ElectionWithCandidates, ElectionStatus } from '../../types/election.types';
import Badge from '../shared/Badge';
import Button from '../shared/Button';

interface ElectionCardProps {
  election: ElectionWithCandidates;
  showVoteButton?: boolean;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, showVoteButton = true }) => {
  const navigate = useNavigate();

  const getStatusBadgeVariant = (status: ElectionStatus) => {
    switch (status) {
      case ElectionStatus.ACTIVE:
        return 'success';
      case ElectionStatus.SCHEDULED:
        return 'info';
      case ElectionStatus.CLOSED:
        return 'warning';
      case ElectionStatus.PUBLISHED:
        return 'default';
      default:
        return 'default';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(election.endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const isUpcoming = () => {
    const now = new Date();
    const start = new Date(election.startDate);
    return start > now;
  };

  const canVote = election.status === ElectionStatus.ACTIVE && !election.hasVoted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{election.title}</h3>
            <p className="text-blue-100 text-sm mt-1 line-clamp-2">{election.description}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(election.status)} className="ml-2">
            {election.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Election Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">
              {isUpcoming() ? 'Starts: ' : 'Started: '}
              {new Date(election.startDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">
              {election.status === ElectionStatus.ACTIVE ? getTimeRemaining() : 'Ends: ' + new Date(election.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{election.candidates.length} Candidates</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{election._count?.votes || 0} Votes</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
            {election.votingType.replace('_', ' ')}
          </span>
          {election.isAnonymous && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Anonymous
            </span>
          )}
          {election.hasVoted && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Voted
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/elections/${election.id}`)}
            variant="secondary"
            className="flex-1"
          >
            View Details
          </Button>

          {showVoteButton && canVote && (
            <Button
              onClick={() => navigate(`/vote/${election.id}`)}
              className="flex-1"
            >
              Vote Now
            </Button>
          )}

          {election.status === ElectionStatus.PUBLISHED && (
            <Button
              onClick={() => navigate(`/results/${election.id}`)}
              variant="secondary"
              className="flex-1"
            >
              View Results
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionCard;
