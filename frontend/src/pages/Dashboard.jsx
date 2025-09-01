import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Redirect based on user role
  if (currentUser?.role === 'admin') {
    window.location.href = '/admin/dashboard';
    return null;
  }
  
  if (currentUser?.role === 'executive') {
    window.location.href = '/executive/dashboard';
    return null;
  }

  // Mock data for elections
  const activeElections = [
    {
      id: '1',
      title: 'Student Council Election 2024',
      description: 'Annual election for student council positions',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      status: 'active',
      totalCandidates: 8,
      hasVoted: false
    },
    {
      id: '2',
      title: 'Department Representative',
      description: 'Election for department student representative',
      startDate: '2024-03-18',
      endDate: '2024-03-25',
      status: 'upcoming',
      totalCandidates: 5,
      hasVoted: false
    }
  ];

  const recentElections = [
    {
      id: '3',
      title: 'Class Monitor Election',
      description: 'Election for class monitor position',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      status: 'completed',
      totalCandidates: 3,
      hasVoted: true,
      result: 'John Smith won with 45 votes'
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {currentUser?.fullName || 'Voter'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your voting activities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Elections</p>
                <p className="text-2xl font-bold text-primary">{activeElections.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-secondary">{activeElections.filter(e => e.status === 'upcoming').length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-accent/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Votes Cast</p>
                <p className="text-2xl font-bold text-accent">{recentElections.filter(e => e.hasVoted).length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-light/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Elections</p>
                <p className="text-2xl font-bold text-gray-700">{activeElections.length + recentElections.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Elections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Active Elections</h2>
            <Link to="/elections" className="text-primary hover:text-primary/80 font-medium">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeElections.map((election) => (
              <div key={election.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {getStatusText(election.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {election.totalCandidates} candidates
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{election.description}</p>
                
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
                
                {election.status === 'active' && !election.hasVoted && (
                  <Link
                    to={`/elections/${election.id}`}
                    className="btn-primary w-full text-center"
                  >
                    Vote Now
                  </Link>
                )}
                
                {election.status === 'upcoming' && (
                  <button className="btn-secondary w-full" disabled>
                    Coming Soon
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Elections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Recent Elections</h2>
            <Link to="/voting-history" className="text-primary hover:text-primary/80 font-medium">
              View History →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentElections.map((election) => (
              <div key={election.id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {getStatusText(election.status)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Voted
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{election.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{election.description}</p>
                
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
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium">Result:</p>
                  <p className="text-sm text-gray-600">{election.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/elections"
                className="flex items-center p-3 rounded-lg border border-light hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Browse All Elections</span>
              </Link>
              
              <Link
                to="/voting-history"
                className="flex items-center p-3 rounded-lg border border-light hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>View Voting History</span>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center p-3 rounded-lg border border-light hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Update Profile</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Having trouble with voting or have questions about the process?
            </p>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-light hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>FAQ & Help Center</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-light hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact Support</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

