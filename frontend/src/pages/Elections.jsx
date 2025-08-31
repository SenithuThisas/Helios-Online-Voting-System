import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Elections = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for elections
  const elections = [
    {
      id: '1',
      title: 'Student Council Election 2024',
      description: 'Annual election for student council positions including President, Vice President, Secretary, and Treasurer.',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      status: 'active',
      totalCandidates: 8,
      totalVotes: 156,
      hasVoted: false,
      category: 'Student Government'
    },
    {
      id: '2',
      title: 'Department Representative',
      description: 'Election for department student representative to serve on the academic council.',
      startDate: '2024-03-18',
      endDate: '2024-03-25',
      status: 'upcoming',
      totalCandidates: 5,
      totalVotes: 0,
      hasVoted: false,
      category: 'Academic'
    },
    {
      id: '3',
      title: 'Sports Committee Election',
      description: 'Election for sports committee members to organize athletic events and activities.',
      startDate: '2024-03-22',
      endDate: '2024-03-28',
      status: 'upcoming',
      totalCandidates: 6,
      totalVotes: 0,
      hasVoted: false,
      category: 'Activities'
    },
    {
      id: '4',
      title: 'Class Monitor Election',
      description: 'Election for class monitor position to represent the class in various matters.',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      status: 'completed',
      totalCandidates: 3,
      totalVotes: 89,
      hasVoted: true,
      category: 'Class',
      result: 'John Smith won with 45 votes'
    },
    {
      id: '5',
      title: 'Library Committee Election',
      description: 'Election for library committee members to improve library services.',
      startDate: '2024-02-10',
      endDate: '2024-02-15',
      status: 'completed',
      totalCandidates: 4,
      totalVotes: 67,
      hasVoted: true,
      category: 'Academic',
      result: 'Maria Garcia won with 28 votes'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active Now';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Student Government':
        return 'bg-purple-100 text-purple-800';
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Activities':
        return 'bg-green-100 text-green-800';
      case 'Class':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredElections = elections.filter(election => {
    const matchesFilter = activeFilter === 'all' || election.status === activeFilter;
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilteredCount = (status) => {
    if (status === 'all') return elections.length;
    return elections.filter(e => e.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Elections</h1>
          <p className="text-gray-600">
            Browse and participate in available elections
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search elections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'completed', label: 'Completed' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-light hover:bg-gray-50'
                  }`}
                >
                  {filter.label} ({getFilteredCount(filter.key)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No elections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <div key={election.id} className="card hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {getStatusText(election.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(election.category)}`}>
                    {election.category}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{election.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-primary">{election.totalCandidates}</div>
                    <div className="text-xs text-gray-500">Candidates</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-secondary">{election.totalVotes}</div>
                    <div className="text-xs text-gray-500">Votes</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Start:</span>
                    <span className="font-medium">{new Date(election.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">End:</span>
                    <span className="font-medium">{new Date(election.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Button */}
                {election.status === 'active' && !election.hasVoted && (
                  <Link
                    to={`/elections/${election.id}`}
                    className="btn-primary w-full text-center"
                  >
                    Vote Now
                  </Link>
                )}

                {election.status === 'active' && election.hasVoted && (
                  <button className="btn-secondary w-full" disabled>
                    ✓ Already Voted
                  </button>
                )}

                {election.status === 'upcoming' && (
                  <button className="btn-secondary w-full" disabled>
                    Coming Soon
                  </button>
                )}

                {election.status === 'completed' && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 font-medium">Result:</p>
                      <p className="text-sm text-gray-600">{election.result}</p>
                    </div>
                    <Link
                      to={`/elections/${election.id}`}
                      className="btn-accent w-full text-center"
                    >
                      View Results
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {elections.filter(e => e.status === 'active').length}
            </div>
            <div className="text-gray-600">Active Elections</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {elections.filter(e => e.status === 'upcoming').length}
            </div>
            <div className="text-gray-600">Upcoming Elections</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {elections.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed Elections</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-700 mb-2">
              {elections.reduce((total, e) => total + e.totalVotes, 0)}
            </div>
            <div className="text-gray-600">Total Votes Cast</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;

