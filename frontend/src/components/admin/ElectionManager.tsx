import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ElectionWithCandidates, ElectionStatus } from '../../types/election.types';
import { apiRequest } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import { useNavigate } from 'react-router-dom';

const ElectionManager: React.FC = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState<ElectionWithCandidates[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get<ElectionWithCandidates[]>('/elections');
      setElections(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const handleStartElection = async (electionId: string) => {
    try {
      setActionLoading(electionId);
      await apiRequest.patch(`/elections/${electionId}/start`);
      toast.success('Election started successfully');
      fetchElections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start election');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseElection = async (electionId: string) => {
    if (!window.confirm('Are you sure you want to close this election? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(electionId);
      await apiRequest.patch(`/elections/${electionId}/close`);
      toast.success('Election closed successfully');
      fetchElections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to close election');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublishResults = async (electionId: string) => {
    try {
      setActionLoading(electionId);
      await apiRequest.patch(`/elections/${electionId}/publish`);
      toast.success('Results published successfully');
      fetchElections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish results');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteElection = async (electionId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(electionId);
      await apiRequest.delete(`/elections/${electionId}`);
      toast.success('Election deleted successfully');
      fetchElections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete election');
    } finally {
      setActionLoading(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Elections</h2>
          <p className="text-gray-600 mt-1">View and manage all elections</p>
        </div>
        <Button onClick={() => navigate('/admin/elections/create')}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Election
        </Button>
      </div>

      {elections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {elections.map((election) => (
            <motion.div
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{election.title}</h3>
                      <p className="text-gray-600 mt-1">{election.description}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(election.status)}>
                      {election.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Start: {new Date(election.startDate).toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      End: {new Date(election.endDate).toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Candidates: {election.candidates.length}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Votes: {election._count?.votes || 0}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {election.votingType.replace('_', ' ')}
                    </span>
                    {election.isAnonymous && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                  {election.status === ElectionStatus.SCHEDULED && (
                    <Button
                      onClick={() => handleStartElection(election.id)}
                      loading={actionLoading === election.id}
                      className="w-full"
                    >
                      Start Election
                    </Button>
                  )}

                  {election.status === ElectionStatus.ACTIVE && (
                    <Button
                      onClick={() => handleCloseElection(election.id)}
                      loading={actionLoading === election.id}
                      variant="danger"
                      className="w-full"
                    >
                      Close Election
                    </Button>
                  )}

                  {election.status === ElectionStatus.CLOSED && (
                    <Button
                      onClick={() => handlePublishResults(election.id)}
                      loading={actionLoading === election.id}
                      className="w-full"
                    >
                      Publish Results
                    </Button>
                  )}

                  <Button
                    onClick={() => navigate(`/elections/${election.id}`)}
                    variant="secondary"
                    className="w-full"
                  >
                    View Details
                  </Button>

                  {election.status === ElectionStatus.DRAFT && (
                    <Button
                      onClick={() => handleDeleteElection(election.id, election.title)}
                      loading={actionLoading === election.id}
                      variant="danger"
                      className="w-full"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-gray-600">No elections found</p>
          <Button onClick={() => navigate('/admin/elections/create')} className="mt-4">
            Create Your First Election
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElectionManager;
