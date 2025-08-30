import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalElections: 0,
    totalCandidates: 0,
    totalVotes: 0
  });
  const [recentElections, setRecentElections] = useState([]);
  const [activeElections, setActiveElections] = useState([]);
  const [usersByDivision, setUsersByDivision] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      const { statistics, recentElections: recent, activeElections: active, usersByDivision: divisionStats } = response.data;
      
      setStats(statistics);
      setRecentElections(recent);
      setActiveElections(active);
      setUsersByDivision(divisionStats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badgeStyles = {
      upcoming: 'badge-info',
      active: 'badge-success',
      completed: 'badge-warning',
      cancelled: 'badge-error'
    };

    return (
      <span className={`badge ${badgeStyles[status] || 'badge-info'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Admin Dashboard 🛠️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          Manage users, elections, and monitor system performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            👥
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalUsers}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Users</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
            🗳️
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalElections}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Elections</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            👨‍💼
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalCandidates}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Candidates</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            ✅
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalVotes}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Votes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">
            Create Election
          </button>
          <button className="btn btn-secondary">
            Add Candidate
          </button>
          <button className="btn btn-outline">
            Manage Users
          </button>
          <button className="btn btn-outline">
            View Reports
          </button>
        </div>
      </div>

      {/* Active Elections */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Active Elections</h3>
        </div>
        
        {activeElections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No active elections at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {activeElections.map((election) => (
              <div
                key={election._id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--light)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--background)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                      {election.title}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                      🏢 {election.division} • 📊 {election.totalVotes} votes
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                      View Results
                    </button>
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Elections */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Elections</h3>
        </div>
        
        {recentElections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No elections created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {recentElections.map((election) => (
              <div
                key={election._id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--light)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--background)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>
                    {election.title}
                  </h4>
                  {getStatusBadge(election.status)}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <span>📅 {formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
                    <span style={{ marginLeft: '1rem' }}>📊 {election.totalVotes} votes</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                      View Details
                    </button>
                    <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Statistics by Division */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Users by Division</h3>
        </div>
        
        {usersByDivision.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No user data available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            {usersByDivision.map((division) => (
              <div
                key={division._id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--light)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--background)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  {division.count}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {division._id} Division
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
