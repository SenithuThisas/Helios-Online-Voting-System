import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from './env';
import { logger } from '../utils/logger';
import { verifyAccessToken } from '../utils/jwt';

// Define Socket.io event types
export interface ServerToClientEvents {
  'vote-cast': (data: { electionId: string; totalVotes: number }) => void;
  'election-started': (data: { electionId: string; title: string }) => void;
  'election-closed': (data: { electionId: string; title: string }) => void;
  'election-published': (data: { electionId: string; title: string }) => void;
  'results-updated': (data: { electionId: string; results: any }) => void;
  'error': (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'join-election': (electionId: string) => void;
  'leave-election': (electionId: string) => void;
  'join-organization': (organizationId: string) => void;
  'leave-organization': (organizationId: string) => void;
}

export interface SocketData {
  userId?: string;
  organizationId?: string;
}

export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>;

export type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>;

let io: TypedServer;

/**
 * Initialize Socket.io server
 */
export const initializeSocket = (httpServer: HTTPServer): TypedServer => {
  io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(
    httpServer,
    {
      cors: {
        origin: config.CORS_ORIGIN,
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    }
  );

  // Authentication middleware
  io.use((socket: TypedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        logger.warn('Socket connection without token');
        return next();
      }

      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      socket.data.organizationId = payload.organizationId;

      logger.info(`Socket authenticated: ${socket.id} (User: ${payload.userId})`);
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next();
    }
  });

  // Connection handler
  io.on('connection', (socket: TypedSocket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join election room
    socket.on('join-election', (electionId: string) => {
      socket.join(`election:${electionId}`);
      logger.info(`Socket ${socket.id} joined election ${electionId}`);
    });

    // Leave election room
    socket.on('leave-election', (electionId: string) => {
      socket.leave(`election:${electionId}`);
      logger.info(`Socket ${socket.id} left election ${electionId}`);
    });

    // Join organization room
    socket.on('join-organization', (organizationId: string) => {
      socket.join(`organization:${organizationId}`);
      logger.info(`Socket ${socket.id} joined organization ${organizationId}`);
    });

    // Leave organization room
    socket.on('leave-organization', (organizationId: string) => {
      socket.leave(`organization:${organizationId}`);
      logger.info(`Socket ${socket.id} left organization ${organizationId}`);
    });

    // Disconnection handler
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('✅ Socket.io initialized successfully');
  return io;
};

/**
 * Get Socket.io server instance
 */
export const getIO = (): TypedServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emit vote cast event to election room
 */
export const emitVoteCast = (electionId: string, totalVotes: number): void => {
  if (io) {
    io.to(`election:${electionId}`).emit('vote-cast', { electionId, totalVotes });
  }
};

/**
 * Emit election started event
 */
export const emitElectionStarted = (electionId: string, title: string): void => {
  if (io) {
    io.emit('election-started', { electionId, title });
  }
};

/**
 * Emit election closed event
 */
export const emitElectionClosed = (electionId: string, title: string): void => {
  if (io) {
    io.emit('election-closed', { electionId, title });
  }
};

/**
 * Emit results published event
 */
export const emitResultsPublished = (electionId: string, title: string): void => {
  if (io) {
    io.emit('election-published', { electionId, title });
  }
};

/**
 * Emit results updated event
 */
export const emitResultsUpdated = (electionId: string, results: any): void => {
  if (io) {
    io.to(`election:${electionId}`).emit('results-updated', { electionId, results });
  }
};

export default { initializeSocket, getIO };
