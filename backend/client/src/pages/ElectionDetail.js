import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchElectionData();
  }, [id]);

  const fetchElectionData = async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        axios.get(`/api/vote/elections/${id}`),
        axios.get(`/api/vote/elections/${id}/candidates`)
      ]);

      setElection(electionRes.data.election);
      setCandidates(candidatesRes.data.candidates);
    } catch (error) {
      console.error('Error fetching election data:', error);
      toast.error('Failed to load election data');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate to vote for');
      return;
    }

    setVoting(true);
    try {
      await axios.post(`/api/vote/elections/${id}/vote`, {
        candidateId: selectedCandidate
      });

      toast.success('Vote submitted successfully!');
      navigate('/voting-history');
    } catch (error) {
      console.error('Error submitting vote:', error);
      const message = error.response?.data?.message || 'Failed to submit vote';
      toast.error(message);
    } finally {
      setVoting(false);
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
      month: 'long',
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

  if (!election) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 style={{ color: 'var(--error)' }}>Election not found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            The election you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {election.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', margin: 0 }}>
              {election.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            {getStatusBadge(election.status)}
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {election.totalVotes} votes cast
            </div>
          </div>
        </div>
      </div>

      {/* Election Details */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Election Details</h3>
        </div>
        
        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
              Election Information
            </h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                📅 Election Period
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                🏢 Division
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {election.division}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                👨‍💼 Maximum Candidates
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {election.maxCandidates}
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '2px solid var(--light)', paddingBottom: '0.5rem' }}>
              Current Status
            </h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                📊 Total Votes
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {election.totalVotes}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                🔒 Ballot Type
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {election.isSecretBallot ? 'Secret Ballot' : 'Public Ballot'}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                📅 Created
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {formatDate(election.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 className="card-title">Candidates ({candidates.length})</h3>
        </div>
        
        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <p>No candidates have been added to this election yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                style={{
                  padding: '1.5rem',
                  border: '2px solid',
                  borderColor: selectedCandidate === candidate._id ? 'var(--primary)' : 'var(--light)',
                  borderRadius: '0.75rem',
                  backgroundColor: selectedCandidate === candidate._id ? 'rgba(61, 82, 160, 0.05)' : 'var(--background)',
                  cursor: election.status === 'active' && !election.hasVoted ? 'pointer' : 'default',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => {
                  if (election.status === 'active' && !election.hasVoted) {
                    setSelectedCandidate(candidate._id);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                      {candidate.fullName}
                    </h4>
                    <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {candidate.position}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                      {candidate.manifesto}
                    </p>
                  </div>
                  
                  {election.status === 'active' && !election.hasVoted && (
                    <div style={{ marginLeft: '1rem' }}>
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate._id}
                        checked={selectedCandidate === candidate._id}
                        onChange={() => setSelectedCandidate(candidate._id)}
                        style={{ transform: 'scale(1.5)' }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--white)',
                  borderRadius: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      🆔 Membership ID
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {candidate.membershipId}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      🏢 Division
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {candidate.division}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                      💼 Experience
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {candidate.experience}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voting Section */}
      {election.status === 'active' && !election.hasVoted && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '2px solid var(--success)' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--success)' }}>
              🗳️ Cast Your Vote
            </h3>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Please select a candidate from the list above and click the "Submit Vote" button to cast your vote.
            </p>
            
            {selectedCandidate && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--success)', 
                color: 'var(--white)', 
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <strong>Selected Candidate:</strong> {candidates.find(c => c._id === selectedCandidate)?.fullName}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleVote}
              disabled={!selectedCandidate || voting}
              className="btn btn-success"
              style={{ 
                backgroundColor: 'var(--success)',
                fontSize: '1.125rem',
                padding: '1rem 2rem'
              }}
            >
              {voting ? <span className="spinner"></span> : 'Submit Vote'}
            </button>
          </div>
        </div>
      )}

      {/* Already Voted Message */}
      {election.hasVoted && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(61, 82, 160, 0.05)', border: '2px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
              You have already voted in this election
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Thank you for participating in this election. You can view the results once the election is completed.
            </p>
            <button
              onClick={() => navigate('/voting-history')}
              className="btn btn-primary"
            >
              View Your Voting History
            </button>
          </div>
        </div>
      )}

      {/* Election Not Active */}
      {election.status !== 'active' && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '2px solid var(--warning)' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {election.status === 'upcoming' ? '⏰' : '✅'}
            </div>
            <h3 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>
              {election.status === 'upcoming' ? 'Election Not Yet Active' : 'Election Completed'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {election.status === 'upcoming' 
                ? 'This election will be active from ' + formatDate(election.startDate)
                : 'This election has been completed. You can view the results below.'
              }
            </p>
            
            {election.status === 'completed' && (
              <button
                onClick={() => navigate(`/elections/${id}/results`)}
                className="btn btn-warning"
                style={{ backgroundColor: 'var(--warning)' }}
              >
                View Election Results
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/elections')}
          className="btn btn-outline"
        >
          Back to Elections
        </button>
        
        {election.status === 'completed' && (
          <button
            onClick={() => navigate(`/elections/${id}/results`)}
            className="btn btn-secondary"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
};

export default ElectionDetail;
