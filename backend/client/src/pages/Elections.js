import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, upcoming, completed

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get('/api/vote/elections');
      setElections(response.data.elections);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections');
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

  const filteredElections = elections.filter(election => {
    if (filter === 'all') return true;
    return election.status === filter;
  });

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
          Elections 🗳️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          View and participate in available elections
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Elections', count: elections.length },
            { key: 'active', label: 'Active', count: elections.filter(e => e.status === 'active').length },
            { key: 'upcoming', label: 'Upcoming', count: elections.filter(e => e.status === 'upcoming').length },
            { key: 'completed', label: 'Completed', count: elections.filter(e => e.status === 'completed').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: filter === tab.key ? 'var(--primary)' : 'var(--white)',
                color: filter === tab.key ? 'var(--white)' : 'var(--text-primary)',
                border: `2px solid ${filter === tab.key ? 'var(--primary)' : 'var(--light)'}`,
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Elections Grid */}
      {filteredElections.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {filter === 'active' ? '📭' : filter === 'upcoming' ? '⏰' : filter === 'completed' ? '✅' : '📋'}
          </div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {filter === 'active' ? 'No Active Elections' : 
             filter === 'upcoming' ? 'No Upcoming Elections' : 
             filter === 'completed' ? 'No Completed Elections' : 'No Elections Available'}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {filter === 'active' ? 'Check back later for new voting opportunities.' :
             filter === 'upcoming' ? 'No elections are scheduled at the moment.' :
             filter === 'completed' ? 'No elections have been completed yet.' :
             'There are no elections available in your division.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1" style={{ gap: '1.5rem' }}>
          {filteredElections.map((election) => (
            <div key={election._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                    {election.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                    {election.description}
                  </p>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  {getStatusBadge(election.status)}
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--background)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    📅 Election Period
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {formatDate(election.startDate)} - {formatDate(election.endDate)}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    🏢 Division
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {election.division}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    👨‍💼 Max Candidates
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {election.maxCandidates}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    📊 Total Votes
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {election.totalVotes}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>Created: {formatDate(election.createdAt)}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    to={`/elections/${election._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  
                  {election.status === 'active' && (
                    <Link
                      to={`/elections/${election._id}`}
                      className="btn btn-secondary"
                    >
                      Vote Now
                    </Link>
                  )}
                  
                  {election.status === 'completed' && (
                    <Link
                      to={`/elections/${election._id}/results`}
                      className="btn btn-outline"
                    >
                      View Results
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Elections;
