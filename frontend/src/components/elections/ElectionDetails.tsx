import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ElectionWithCandidates, ElectionStatus } from '../../types/election.types';
import { apiRequest } from '../../services/api';
import toast from 'react-hot-toast';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import Card from '../shared/Card';

const ElectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [election, setElection] = useState<ElectionWithCandidates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchElectionDetails();
    }
  }, [id]);

  const fetchElectionDetails = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get<ElectionWithCandidates>(`/elections/${id}`);
      setElection(response.data!);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load election details');
      navigate('/elections');
    } finally {
      setLoading(false);
    }
  };

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
    if (!election) return '';

    const now = new Date();
    const end = new Date(election.endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days, ${hours} hours remaining`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes remaining`;
    return `${minutes} minutes remaining`;
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

  const canVote = election.status === ElectionStatus.ACTIVE && !election.hasVoted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold">{election.title}</h1>
            <p className="text-blue-100 mt-2 text-lg">{election.description}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(election.status)} className="self-start">
            {election.status}
          </Badge>
        </div>

        {election.status === ElectionStatus.ACTIVE && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{getTimeRemaining()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Election Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Start Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(election.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(election.startDate).toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">End Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(election.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(election.endDate).toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Votes</p>
              <p className="text-2xl font-bold text-green-600">{election._count?.votes || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Election Settings */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Election Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700">
              Voting Type: <span className="font-semibold">{election.votingType.replace('_', ' ')}</span>
            </span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-gray-700">
              Privacy: <span className="font-semibold">{election.isAnonymous ? 'Anonymous' : 'Public'}</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Candidates */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Candidates ({election.candidates.length})</h2>
          {canVote && (
            <Button onClick={() => navigate(`/vote/${election.id}`)}>
              Vote Now
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {election.candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {candidate.photo ? (
                <img
                  src={candidate.photo}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-3"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                  {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <h3 className="text-center font-semibold text-gray-800">{candidate.name}</h3>
              {candidate.description && (
                <p className="text-sm text-gray-600 text-center mt-2">{candidate.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/elections')} variant="secondary" className="flex-1">
          Back to Elections
        </Button>

        {canVote && (
          <Button onClick={() => navigate(`/vote/${election.id}`)} className="flex-1">
            Vote Now
          </Button>
        )}

        {election.hasVoted && election.status === ElectionStatus.ACTIVE && (
          <div className="flex-1 flex items-center justify-center bg-green-100 text-green-800 rounded-lg px-4 py-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You have already voted
          </div>
        )}

        {election.status === ElectionStatus.PUBLISHED && (
          <Button onClick={() => navigate(`/results/${election.id}`)} className="flex-1">
            View Results
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ElectionDetails;
