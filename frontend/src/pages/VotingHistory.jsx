import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VotingHistory = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data for voting history
  const votingHistory = [
    {
      id: '1',
      electionTitle: 'Student Council Election 2024',
      electionId: '1',
      category: 'Student Government',
      votedDate: '2024-03-16',
      status: 'completed',
      result: 'John Smith won with 45 votes',
      totalVotes: 156,
      yourVote: 'John Smith - President'
    },
    {
      id: '2',
      electionTitle: 'Class Monitor Election',
      electionId: '4',
      category: 'Class',
      votedDate: '2024-02-22',
      status: 'completed',
      result: 'John Smith won with 45 votes',
      totalVotes: 89,
      yourVote: 'John Smith - Class Monitor'
    },
    {
      id: '3',
      electionTitle: 'Library Committee Election',
      electionId: '5',
      category: 'Academic',
      votedDate: '2024-02-12',
      status: 'completed',
      result: 'Maria Garcia won with 28 votes',
      totalVotes: 67,
      yourVote: 'Maria Garcia - Library Committee'
    },
    {
      id: '4',
      electionTitle: 'Sports Committee Election',
      electionId: '6',
      category: 'Activities',
      votedDate: '2024-01-15',
      status: 'completed',
      result: 'David Wilson won with 32 votes',
      totalVotes: 78,
      yourVote: 'David Wilson - Sports Committee'
    }
  ];

  const upcomingElections = [
    {
      id: '2',
      title: 'Department Representative',
      category: 'Academic',
      startDate: '2024-03-18',
      endDate: '2024-03-25',
      totalCandidates: 5
    },
    {
      id: '3',
      title: 'Sports Committee Election',
      category: 'Activities',
      startDate: '2024-03-22',
      endDate: '2024-03-28',
      totalCandidates: 6
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
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

  const filteredHistory = activeFilter === 'all' 
    ? votingHistory 
    : votingHistory.filter(item => item.status === activeFilter);

  const getFilteredCount = (status) => {
    if (status === 'all') return votingHistory.length;
    return votingHistory.filter(item => item.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Voting History</h1>
          <p className="text-gray-600">
            Track your voting participation and view past election results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {votingHistory.length}
            </div>
            <div className="text-gray-600">Elections Voted In</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {upcomingElections.length}
            </div>
            <div className="text-gray-600">Upcoming Elections</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {votingHistory.reduce((total, item) => total + item.totalVotes, 0)}
            </div>
            <div className="text-gray-600">Total Votes Cast</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-700 mb-2">
              {Math.round((votingHistory.length / (votingHistory.length + upcomingElections.length)) * 100)}%
            </div>
            <div className="text-gray-600">Participation Rate</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Elections' },
                { key: 'completed', label: 'Completed' },
                { key: 'active', label: 'Active' },
                { key: 'upcoming', label: 'Upcoming' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeFilter === filter.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {filter.label} ({getFilteredCount(filter.key)})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Voting History */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Your Voting Record</h2>
          
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No voting history found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter === 'all' 
                  ? "You haven't participated in any elections yet."
                  : `No ${activeFilter} elections found in your history.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHistory.map((item) => (
                <div key={item.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Voted on {new Date(item.votedDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.electionTitle}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-primary">{item.totalVotes}</div>
                      <div className="text-xs text-gray-500">Total Votes</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-secondary">✓</div>
                      <div className="text-xs text-gray-500">Your Vote</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-accent">1</div>
                      <div className="text-xs text-gray-500">Votes Cast</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Your Choice:</h4>
                      <p className="text-sm text-gray-900 font-medium">{item.yourVote}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Election Result:</h4>
                      <p className="text-sm text-gray-900">{item.result}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-light">
                    <Link
                      to={`/elections/${item.electionId}`}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      View Election Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Elections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Upcoming Elections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingElections.map((election) => (
              <div key={election.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(election.category)}`}>
                    {election.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {election.totalCandidates} candidates
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
                
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
                
                <Link
                  to={`/elections/${election.id}`}
                  className="btn-secondary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Participation Insights */}
        <div className="card">
          <h3 className="text-xl font-semibold text-primary mb-4">Your Participation Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Voting Categories</h4>
              <div className="space-y-2">
                {Object.entries(
                  votingHistory.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-medium text-primary">{count} elections</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {votingHistory
                  .sort((a, b) => new Date(b.votedDate) - new Date(a.votedDate))
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{item.electionTitle}</span>
                      <span className="text-sm text-gray-500">{new Date(item.votedDate).toLocaleDateString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingHistory;

