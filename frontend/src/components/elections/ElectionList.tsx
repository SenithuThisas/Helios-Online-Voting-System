import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ElectionCard from './ElectionCard';
import { ElectionWithCandidates, ElectionStatus } from '../../types/election.types';
import useElectionStore from '../../store/electionStore';
import { apiRequest } from '../../services/api';
import toast from 'react-hot-toast';

interface ElectionListProps {
  filter?: 'all' | 'active' | 'upcoming' | 'past';
  showVoteButtons?: boolean;
}

const ElectionList: React.FC<ElectionListProps> = ({
  filter = 'all',
  showVoteButtons = true
}) => {
  const { elections, setElections, setLoading, isLoading } = useElectionStore();
  const [filteredElections, setFilteredElections] = useState<ElectionWithCandidates[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ElectionStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [elections, filter, searchTerm, statusFilter]);

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

  const applyFilters = () => {
    let filtered = [...elections];
    const now = new Date();

    // Apply preset filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(e => e.status === ElectionStatus.ACTIVE);
        break;
      case 'upcoming':
        filtered = filtered.filter(e =>
          e.status === ElectionStatus.SCHEDULED ||
          new Date(e.startDate) > now
        );
        break;
      case 'past':
        filtered = filtered.filter(e =>
          e.status === ElectionStatus.CLOSED ||
          e.status === ElectionStatus.PUBLISHED
        );
        break;
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    // Sort by start date (newest first)
    filtered.sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    setFilteredElections(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ElectionStatus | 'ALL')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value={ElectionStatus.ACTIVE}>Active</option>
              <option value={ElectionStatus.SCHEDULED}>Scheduled</option>
              <option value={ElectionStatus.CLOSED}>Closed</option>
              <option value={ElectionStatus.PUBLISHED}>Published</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredElections.length} of {elections.length} elections
        </div>
      </div>

      {/* Elections Grid */}
      {filteredElections.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredElections.map((election, index) => (
            <motion.div
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ElectionCard election={election} showVoteButton={showVoteButtons} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
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
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ElectionList;
