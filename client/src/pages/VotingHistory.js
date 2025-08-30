import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const VotingHistory = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVotingHistory();
  }, []);

  const fetchVotingHistory = async () => {
    try {
      const response = await axios.get('/api/vote/my-votes');
      setVotes(response.data.votes);
    } catch (error) {
      console.error('Error fetching voting history:', error);
      toast.error('Failed to load voting history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          Voting History 📊
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          Track your participation in all elections
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            🗳️
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {votes.length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Votes Cast</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            ✅
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {votes.filter(vote => vote.election?.status === 'completed').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Completed Elections</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
            🏆
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {votes.filter(vote => vote.election?.status === 'active').length}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Active Elections</div>
        </div>
      </div>

      {/* Voting History List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Your Voting Record</h3>
        </div>
        
        {votes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Votes Cast Yet
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You haven't participated in any elections yet.
            </p>
            <Link to="/elections" className="btn btn-primary">
              View Available Elections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {votes.map((vote) => (
              <div
                key={vote._id}
                style={{
                  padding: '1.5rem',
                  border: '1px solid var(--light)',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--background)',
                  position: 'relative'
                }}
              >
                {/* Vote Status Badge */}
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className={`badge ${
                    vote.election?.status === 'active' ? 'badge-success' :
                    vote.election?.status === 'completed' ? 'badge-warning' :
                    vote.election?.status === 'upcoming' ? 'badge-info' : 'badge-error'
                  }`}>
                    {vote.election?.status?.charAt(0).toUpperCase() + vote.election?.status?.slice(1)}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                    {vote.election?.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                    Voted for: <strong>{vote.candidate?.fullName}</strong> • Position: {vote.candidate?.position}
                  </p>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      📅 Vote Cast
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {formatDate(vote.timestamp)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      🗳️ Election Period
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {vote.election?.startDate && vote.election?.endDate ? 
                        `${new Date(vote.election.startDate).toLocaleDateString()} - ${new Date(vote.election.endDate).toLocaleDateString()}` :
                        'N/A'
                      }
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      🏢 Division
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {vote.election?.division || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      🔍 Vote ID
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                      {vote._id.slice(-8)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    to={`/elections/${vote.election?._id}`}
                    className="btn btn-outline"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    View Election
                  </Link>
                  
                  {vote.election?.status === 'completed' && (
                    <Link
                      to={`/elections/${vote.election._id}/results`}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      View Results
                    </Link>
                  )}
                  
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      navigator.clipboard.writeText(vote._id);
                      toast.success('Vote ID copied to clipboard');
                    }}
                  >
                    Copy Vote ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Information Note */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'rgba(61, 82, 160, 0.05)', border: '1px solid var(--light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
          <div>
            <h4 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>About Your Voting Record</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              This page shows all elections you have participated in. Each vote is securely recorded with a unique ID 
              for verification purposes. You can view election details and results for completed elections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingHistory;
