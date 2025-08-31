import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ElectionDetail = () => {
  const { id } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock data for election details
  const election = {
    id: '1',
    title: 'Student Council Election 2024',
    description: 'Annual election for student council positions including President, Vice President, Secretary, and Treasurer. This election will determine the student leadership for the upcoming academic year.',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: 'active',
    totalCandidates: 8,
    totalVotes: 156,
    hasVoted: false,
    category: 'Student Government',
    rules: [
      'Each voter can vote for one candidate per position',
      'Voting is anonymous and secure',
      'Results will be announced after the election period ends',
      'In case of a tie, a runoff election will be held'
    ]
  };

  const candidates = [
    {
      id: '1',
      name: 'John Smith',
      position: 'President',
      party: 'Independent',
      description: 'Experienced student leader with a focus on improving campus life and student services.',
      image: 'https://via.placeholder.com/100x100/3D52A0/FFFFFF?text=JS',
      votes: 45
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'President',
      party: 'Independent',
      description: 'Passionate advocate for student rights and environmental sustainability on campus.',
      image: 'https://via.placeholder.com/100x100/7091E6/FFFFFF?text=SJ',
      votes: 38
    },
    {
      id: '3',
      name: 'Michael Chen',
      position: 'Vice President',
      party: 'Independent',
      description: 'Dedicated to promoting diversity and inclusion in student organizations.',
      image: 'https://via.placeholder.com/100x100/8697C4/FFFFFF?text=MC',
      votes: 52
    },
    {
      id: '4',
      name: 'Emily Davis',
      position: 'Vice President',
      party: 'Independent',
      description: 'Focused on improving academic resources and study spaces for students.',
      image: 'https://via.placeholder.com/100x100/ADBBDA/FFFFFF?text=ED',
      votes: 41
    },
    {
      id: '5',
      name: 'David Wilson',
      position: 'Secretary',
      party: 'Independent',
      description: 'Organized and detail-oriented leader committed to transparent communication.',
      image: 'https://via.placeholder.com/100x100/3D52A0/FFFFFF?text=DW',
      votes: 47
    },
    {
      id: '6',
      name: 'Lisa Brown',
      position: 'Secretary',
      party: 'Independent',
      description: 'Creative problem-solver with experience in event planning and coordination.',
      image: 'https://via.placeholder.com/100x100/7091E6/FFFFFF?text=LB',
      votes: 39
    },
    {
      id: '7',
      name: 'Robert Taylor',
      position: 'Treasurer',
      party: 'Independent',
      description: 'Finance-savvy student with a background in budgeting and financial planning.',
      image: 'https://via.placeholder.com/100x100/8697C4/FFFFFF?text=RT',
      votes: 43
    },
    {
      id: '8',
      name: 'Jennifer Lee',
      position: 'Treasurer',
      party: 'Independent',
      description: 'Advocate for responsible spending and increased funding for student activities.',
      image: 'https://via.placeholder.com/100x100/ADBBDA/FFFFFF?text=JL',
      votes: 35
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

  const handleVote = () => {
    if (selectedCandidate) {
      setShowVoteConfirmation(true);
    }
  };

  const confirmVote = () => {
    // Simulate voting process
    setHasVoted(true);
    setShowVoteConfirmation(false);
    // In a real app, this would make an API call to submit the vote
  };

  const getCandidatesByPosition = () => {
    const positions = ['President', 'Vice President', 'Secretary', 'Treasurer'];
    return positions.map(position => ({
      position,
      candidates: candidates.filter(c => c.position === position)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/elections"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Elections
          </Link>
        </div>

        {/* Election Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(election.status)}`}>
                  {getStatusText(election.status)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
                  {election.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-primary mb-3">{election.title}</h1>
              <p className="text-gray-600 text-lg mb-4">{election.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{election.totalCandidates}</div>
                  <div className="text-sm text-gray-600">Candidates</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{election.totalVotes}</div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {new Date(election.endDate).getDate() - new Date().getDate()}
                  </div>
                  <div className="text-sm text-gray-600">Days Left</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-light pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Election Period</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{new Date(election.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{new Date(election.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Voting Rules</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {election.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Candidates</h2>
          
          {getCandidatesByPosition().map(({ position, candidates: positionCandidates }) => (
            <div key={position} className="card mb-6">
              <h3 className="text-xl font-semibold text-primary mb-4">{position}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {positionCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                      selectedCandidate?.id === candidate.id
                        ? 'border-primary bg-primary/5'
                        : 'border-light hover:border-primary/30'
                    }`}
                    onClick={() => !hasVoted && setSelectedCandidate(candidate)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{candidate.party}</p>
                        <p className="text-sm text-gray-600">{candidate.description}</p>
                      </div>
                      {selectedCandidate?.id === candidate.id && (
                        <div className="text-primary">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Voting Section */}
        {election.status === 'active' && !hasVoted && (
          <div className="card">
            <h3 className="text-xl font-semibold text-primary mb-4">Cast Your Vote</h3>
            
            {!selectedCandidate ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">Please select a candidate to vote for</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">You have selected:</p>
                  <p className="text-lg font-semibold text-primary">{selectedCandidate.name}</p>
                  <p className="text-sm text-gray-500">for {selectedCandidate.position}</p>
                </div>
                
                <button
                  onClick={handleVote}
                  className="btn-primary px-8 py-3"
                >
                  Confirm Vote
                </button>
              </div>
            )}
          </div>
        )}

        {/* Vote Confirmation Modal */}
        {showVoteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
              <h3 className="text-xl font-semibold text-primary mb-4">Confirm Your Vote</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to vote for <strong>{selectedCandidate?.name}</strong> for the position of <strong>{selectedCandidate?.position}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                <strong>Note:</strong> Once submitted, your vote cannot be changed.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowVoteConfirmation(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmVote}
                  className="btn-primary flex-1"
                >
                  Confirm Vote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Already Voted Message */}
        {hasVoted && (
          <div className="card bg-green-50 border-green-200">
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You for Voting!</h3>
              <p className="text-green-600">
                Your vote has been recorded. You can view the results after the election period ends.
              </p>
            </div>
          </div>
        )}

        {/* Election Closed Message */}
        {election.status === 'completed' && (
          <div className="card bg-gray-50 border-gray-200">
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Election Closed</h3>
              <p className="text-gray-600">
                This election has ended. View the results below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionDetail;

