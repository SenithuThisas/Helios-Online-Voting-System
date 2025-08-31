import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalElections: 0,
    activeElections: 0,
    completedElections: 0,
    totalVotes: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [electionsRes, votesRes] = await Promise.all([
        axios.get('/api/vote/elections'),
        axios.get('/api/vote/my-votes')
      ]);

      setElections(electionsRes.data.elections);
      
      const totalVotes = votesRes.data.votes.length;
      const activeElections = electionsRes.data.elections.filter(e => e.status === 'active').length;
      const completedElections = electionsRes.data.elections.filter(e => e.status === 'completed').length;
      
      setStats({
        totalElections: electionsRes.data.elections.length,
        activeElections,
        completedElections,
        totalVotes
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
          Welcome back, {user?.fullName}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          Here's what's happening with your voting activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            📊
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalElections}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Elections</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            🗳️
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.activeElections}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Active Elections</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>
            ✅
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.completedElections}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Completed</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
            🎯
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {stats.totalVotes}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Votes Cast</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/elections" className="btn btn-primary">
            View All Elections
          </Link>
          <Link to="/voting-history" className="btn btn-outline">
            Voting History
          </Link>
          <Link to="/profile" className="btn btn-outline">
            Update Profile
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-secondary">
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Recent Elections */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Elections</h3>
          <Link to="/elections" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
            View All →
          </Link>
        </div>
        
        {elections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No elections available at the moment.</p>
            <p>Check back later for new voting opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {elections.slice(0, 5).map((election) => (
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
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {election.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <span>📅 {formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
                    <span style={{ marginLeft: '1rem' }}>🏢 {election.division}</span>
                  </div>
                  
                  <Link
                    to={`/elections/${election._id}`}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Your Information</h3>
        </div>
        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div>
            <strong>Name:</strong> {user?.fullName}
          </div>
          <div>
            <strong>Division:</strong> {user?.division}
          </div>
          <div>
            <strong>Membership ID:</strong> {user?.membershipId}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
