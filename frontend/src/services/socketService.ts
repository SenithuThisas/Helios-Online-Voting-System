// Socket.io service - Real-time communication with typed events

import { io, Socket } from 'socket.io-client';
import { ElectionResults } from '../types/election.types';

// Define socket event types
interface ServerToClientEvents {
  voteCast: (data: VoteCastData) => void;
  electionStarted: (data: ElectionEventData) => void;
  electionClosed: (data: ElectionEventData) => void;
  resultsPublished: (data: ElectionResults) => void;
  electionUpdated: (data: ElectionEventData) => void;
  userJoined: (data: UserEventData) => void;
  userLeft: (data: UserEventData) => void;
  error: (data: ErrorData) => void;
}

interface ClientToServerEvents {
  joinElection: (electionId: string) => void;
  leaveElection: (electionId: string) => void;
  authenticate: (token: string) => void;
}

interface VoteCastData {
  electionId: string;
  totalVotes: number;
  timestamp: string;
}

interface ElectionEventData {
  electionId: string;
  title: string;
  status: string;
  timestamp: string;
}

interface UserEventData {
  userId: string;
  userName: string;
  electionId: string;
}

interface ErrorData {
  message: string;
  code?: string;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private isConnected = false;

  /**
   * Connect to socket server
   */
  connect(token?: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(socketUrl, {
      auth: {
        token: token || localStorage.getItem('accessToken'),
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Authenticate with token
   */
  authenticate(token: string): void {
    if (this.socket?.connected) {
      this.socket.emit('authenticate', token);
    }
  }

  /**
   * Join an election room
   */
  joinElection(electionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('joinElection', electionId);
      console.log('Joined election:', electionId);
    } else {
      console.warn('Socket not connected. Cannot join election.');
    }
  }

  /**
   * Leave an election room
   */
  leaveElection(electionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveElection', electionId);
      console.log('Left election:', electionId);
    }
  }

  /**
   * Listen for vote cast events
   */
  onVoteCast(callback: (data: VoteCastData) => void): void {
    this.socket?.on('voteCast', callback);
  }

  /**
   * Listen for election started events
   */
  onElectionStarted(callback: (data: ElectionEventData) => void): void {
    this.socket?.on('electionStarted', callback);
  }

  /**
   * Listen for election closed events
   */
  onElectionClosed(callback: (data: ElectionEventData) => void): void {
    this.socket?.on('electionClosed', callback);
  }

  /**
   * Listen for results published events
   */
  onResultsPublished(callback: (data: ElectionResults) => void): void {
    this.socket?.on('resultsPublished', callback);
  }

  /**
   * Listen for election updated events
   */
  onElectionUpdated(callback: (data: ElectionEventData) => void): void {
    this.socket?.on('electionUpdated', callback);
  }

  /**
   * Listen for user joined events
   */
  onUserJoined(callback: (data: UserEventData) => void): void {
    this.socket?.on('userJoined', callback);
  }

  /**
   * Listen for user left events
   */
  onUserLeft(callback: (data: UserEventData) => void): void {
    this.socket?.on('userLeft', callback);
  }

  /**
   * Remove event listener
   */
  off(event: keyof ServerToClientEvents, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: keyof ServerToClientEvents): void {
    if (event) {
      this.socket?.removeAllListeners(event);
    } else {
      this.socket?.removeAllListeners();
    }
  }

  /**
   * Check if socket is connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && !!this.socket?.connected;
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }
}

export default new SocketService();
