import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ElectionResults, CandidateResult } from '../../types/election.types';
import { apiRequest } from '../../services/api';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import ResultsChart from './ResultsChart';
import Card from '../shared/Card';
import Badge from '../shared/Badge';

const LiveResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<ElectionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (id) {
      fetchInitialResults();
      setupSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [id]);

  const fetchInitialResults = async () => {
    try {
      setLoading(true);
      const response = await apiRequest.get<ElectionResults>(`/results/${id}`);
      setResults(response.data!);
      setLastUpdate(new Date());
    } catch (error: any) {
      toast.error(error.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      if (id) {
        newSocket.emit('join-election', id);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('vote-cast', (data: { electionId: string; results: CandidateResult[] }) => {
      if (data.electionId === id && results) {
        setResults({
          ...results,
          results: data.results,
          totalVotes: data.results.reduce((sum, r) => sum + r.voteCount, 0),
        });
        setLastUpdate(new Date());
      }
    });

    newSocket.on('results-update', (data: ElectionResults) => {
      if (data.electionId === id) {
        setResults(data);
        setLastUpdate(new Date());
      }
    });

    setSocket(newSocket);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No results available</p>
      </div>
    );
  }

  const leader = results.results[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-8"
    >
      {/* Header with Live Indicator */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Live Results</h1>
              <AnimatePresence>
                {isConnected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium">LIVE</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-blue-100 mt-2">{results.election.title}</p>
          </div>

          {lastUpdate && (
            <div className="text-right text-sm">
              <p className="text-blue-100">Last Updated</p>
              <p className="font-semibold">{lastUpdate.toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-yellow-700">
              Reconnecting to live updates...
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Votes</p>
              <motion.p
                key={results.totalVotes}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-blue-600"
              >
                {results.totalVotes}
              </motion.p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Participation</p>
              <motion.p
                key={results.participationRate}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-green-600"
              >
                {results.participationRate.toFixed(1)}%
              </motion.p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Leading Candidate</p>
              <motion.p
                key={leader?.candidateName}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-purple-600 truncate"
              >
                {leader?.candidateName || 'N/A'}
              </motion.p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Chart */}
      <Card>
        <h2 className="text-xl font-semibold mb-6">Live Vote Distribution</h2>
        <ResultsChart results={results.results} type="bar" />
      </Card>

      {/* Live Leaderboard */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Live Leaderboard</h2>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {results.results.map((result, index) => (
              <motion.div
                key={result.candidateId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-colors
                  ${index === 0 ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}
                `}
              >
                <div className="flex items-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4
                    ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}
                  `}>
                    {index === 0 ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {result.candidatePhoto ? (
                    <img
                      src={result.candidatePhoto}
                      alt={result.candidateName}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {result.candidateName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{result.candidateName}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2 mr-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-yellow-500' : 'bg-blue-600'
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {result.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <motion.div
                    key={result.voteCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-right ml-4"
                  >
                    <p className="text-2xl font-bold text-gray-800">{result.voteCount}</p>
                    <p className="text-sm text-gray-600">votes</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default LiveResults;
