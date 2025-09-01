import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ExecutiveDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for executive dashboard
  const stats = {
    managedElections: 8,
    activeElections: 2,
    totalCandidates: 45,
    totalVotes: 320,
    pendingApprovals: 3
  };

  const managedElections = [
    {
      id: '1',
      title: 'Student Council Election 2024',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      totalVotes: 156,
      totalCandidates: 8,
      eligibleVoters: 200
    },
    {
      id: '2',
      title: 'Department Representative',
      status: 'upcoming',
      startDate: '2024-03-18',
      endDate: '2024-03-25',
      totalVotes: 0,
      totalCandidates: 5,
      eligibleVoters: 150
    },
    {
      id: '3',
      title: 'Sports Committee Election',
      status: 'draft',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      totalVotes: 0,
      totalCandidates: 0,
      eligibleVoters: 100
    }
  ];

  const candidateApplications = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'Student Council President',
      election: 'Student Council Election 2024',
      submittedDate: '2024-03-10',
      status: 'pending',
      manifesto: 'I will work to improve student facilities and represent student interests...'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'Department Representative',
      election: 'Department Representative',
      submittedDate: '2024-03-09',
      status: 'approved',
      manifesto: 'Focus on academic improvements and better communication...'
    },
    {
      id: '3',
      name: 'Emily Davis',
      position: 'Sports Committee Head',
      election: 'Sports Committee Election',
      submittedDate: '2024-03-08',
      status: 'pending',
      manifesto: 'Promote sports activities and organize tournaments...'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
      case 'draft':
        return 'Draft';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Managed Elections</p>
              <p className="text-2xl font-bold text-primary">{stats.managedElections}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Elections</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeElections}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-secondary/10 p-3 rounded-lg">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalCandidates}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-accent">{stats.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Managed Elections */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Managed Elections</h3>
          <button className="btn-primary">Create New Election</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Votes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {managedElections.map((election) => (
                <tr key={election.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{election.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                      {getStatusText(election.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.totalCandidates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.totalVotes} / {election.eligibleVoters}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/executive/elections/${election.id}`}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      Manage
                    </Link>
                    <button className="text-secondary hover:text-secondary/80">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Candidate Applications</h3>
          <Link to="/executive/candidates" className="text-primary hover:text-primary/80 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="space-y-4">
          {candidateApplications.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-4 border border-light rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {getStatusText(candidate.status)}
                  </span>
                  <h4 className="text-sm font-medium text-gray-900">{candidate.name}</h4>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Position:</strong> {candidate.position}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Election:</strong> {candidate.election}
                </div>
                <div className="text-sm text-gray-500">
                  Applied on {new Date(candidate.submittedDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Manifesto:</strong> {candidate.manifesto.substring(0, 100)}...
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="btn-primary px-4 py-2 text-sm">Review</button>
                {candidate.status === 'pending' && (
                  <>
                    <button className="btn-secondary px-4 py-2 text-sm bg-green-600 hover:bg-green-700">Approve</button>
                    <button className="btn-secondary px-4 py-2 text-sm bg-red-600 hover:bg-red-700">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderElections = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">Election Management</h3>
        <button className="btn-primary">Create New Election</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managedElections.map((election) => (
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
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Start:</span>
                <span className="font-medium">{new Date(election.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">End:</span>
                <span className="font-medium">{new Date(election.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Votes:</span>
                <span className="font-medium">{election.totalVotes} / {election.eligibleVoters}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to={`/executive/elections/${election.id}`}
                className="btn-primary flex-1 text-center"
              >
                Manage
              </Link>
              <button className="btn-secondary px-4">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">Candidate Management</h3>
        <button className="btn-primary">Add Candidate</button>
      </div>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidateApplications.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-sm text-gray-500">
                      Applied {new Date(candidate.submittedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.election}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                      {getStatusText(candidate.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary hover:text-primary/80 mr-3">View</button>
                    {candidate.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-800 mr-3">Approve</button>
                        <button className="text-red-600 hover:text-red-800">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">Election Reports</h3>
        <button className="btn-primary">Generate Report</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-lg font-semibold text-primary mb-4">Voter Turnout</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Student Council Election 2024</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department Representative</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sports Committee Election</span>
              <span className="font-medium">45%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-lg font-semibold text-primary mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-gray-900">New candidate application</div>
              <div className="text-gray-500">Sarah Johnson applied for Student Council President</div>
              <div className="text-gray-400 text-xs">2 hours ago</div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Election started</div>
              <div className="text-gray-500">Student Council Election 2024 is now active</div>
              <div className="text-gray-400 text-xs">1 day ago</div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Candidate approved</div>
              <div className="text-gray-500">Michael Chen approved for Department Representative</div>
              <div className="text-gray-400 text-xs">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">
            Manage elections, candidates, and voting processes
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'elections', label: 'Elections' },
              { id: 'candidates', label: 'Candidates' },
              { id: 'reports', label: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'elections' && renderElections()}
        {activeTab === 'candidates' && renderCandidates()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
