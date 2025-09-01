import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  const { currentUser } = useAuth();
  if (currentUser?.role !== 'admin') {
    window.location.href = '/dashboard';
    return null;
  }

  // Mock data for admin dashboard
  const stats = {
    totalElections: 15,
    activeElections: 3,
    totalVoters: 1250,
    totalVotes: 890,
    pendingApprovals: 5
  };

  const recentElections = [
    {
      id: '1',
      title: 'Student Council Election 2024',
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2024-03-20',
      totalVotes: 156,
      totalCandidates: 8
    },
    {
      id: '2',
      title: 'Department Representative',
      status: 'upcoming',
      startDate: '2024-03-18',
      endDate: '2024-03-25',
      totalVotes: 0,
      totalCandidates: 5
    },
    {
      id: '3',
      title: 'Class Monitor Election',
      status: 'completed',
      startDate: '2024-02-20',
      endDate: '2024-02-25',
      totalVotes: 89,
      totalCandidates: 3
    }
  ];

  const pendingApprovals = [
    {
      id: '1',
      type: 'election',
      title: 'Sports Committee Election',
      submittedBy: 'John Doe',
      submittedDate: '2024-03-10'
    },
    {
      id: '2',
      type: 'candidate',
      title: 'Sarah Johnson - Student Council',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-03-09'
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
              <p className="text-sm font-medium text-gray-600">Total Elections</p>
              <p className="text-2xl font-bold text-primary">{stats.totalElections}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Voters</p>
              <p className="text-2xl font-bold text-secondary">{stats.totalVoters}</p>
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

      {/* Recent Elections */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Recent Elections</h3>
          <Link to="/admin/elections" className="text-primary hover:text-primary/80 font-medium">
            Manage All →
          </Link>
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
                  Dates
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
              {recentElections.map((election) => (
                <tr key={election.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{election.title}</div>
                      <div className="text-sm text-gray-500">{election.totalCandidates} candidates</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                      {getStatusText(election.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(election.startDate).toLocaleDateString()}</div>
                    <div>to {new Date(election.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {election.totalVotes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/admin/elections/${election.id}`}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      View
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

      {/* Pending Approvals */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Pending Approvals</h3>
          <Link to="/admin/approvals" className="text-primary hover:text-primary/80 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="space-y-4">
          {pendingApprovals.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-light rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'election' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'election' ? 'Election' : 'Candidate'}
                  </span>
                  <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Submitted by {item.submittedBy} on {new Date(item.submittedDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="btn-primary px-4 py-2 text-sm">Approve</button>
                <button className="btn-secondary px-4 py-2 text-sm">Reject</button>
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
        <h3 className="text-xl font-semibold text-primary">System Elections Overview</h3>
        <button className="btn-primary">View All Elections</button>
      </div>
      
      <div className="card">
        <p className="text-gray-600 text-center py-8">
          System-wide election monitoring and oversight interface.
          <br />
          Features: View all elections across the system, monitor performance, audit logs, system-wide reports.
        </p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">User Management</h3>
        <button className="btn-primary">Add New User</button>
      </div>
      
      <div className="card">
        <p className="text-gray-600 text-center py-8">
          System user management and role administration.
          <br />
          Features: View all users, manage roles (Admin, Executive, Voter), approve registrations, view activity logs, user permissions.
        </p>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary">System Reports & Analytics</h3>
        <button className="btn-primary">Generate Report</button>
      </div>
      
      <div className="card">
        <p className="text-gray-600 text-center py-8">
          System-wide reports and analytics dashboard.
          <br />
          Features: System performance metrics, user activity analytics, election statistics, audit logs, data export, compliance reports.
        </p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-primary">System Settings</h3>
      
      <div className="card">
        <p className="text-gray-600 text-center py-8">
          System configuration and administration settings.
          <br />
          Features: System configuration, security settings, role permissions, notification preferences, backup/restore, system maintenance.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            System administration and user management
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'elections', label: 'Elections' },
              { id: 'users', label: 'Users' },
              { id: 'reports', label: 'Reports' },
              { id: 'settings', label: 'Settings' }
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
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;

