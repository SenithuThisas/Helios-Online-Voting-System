import http from 'http';
import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { initializeSocket } from './config/socket';
import { logger } from './utils/logger';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');

      await redis.quit();
      logger.info('Redis connection closed');

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    // Test Redis connection
    await redis.ping();
    logger.info('✅ Redis connected successfully');

    // Start listening
    server.listen(config.PORT, () => {
      logger.info(`
      ╔═══════════════════════════════════════════════════════╗
      ║                                                       ║
      ║   🗳️  Helios Online Voting System API               ║
      ║                                                       ║
      ║   Environment: ${config.NODE_ENV.padEnd(38)}║
      ║   Port: ${config.PORT.toString().padEnd(45)}║
      ║   URL: http://localhost:${config.PORT.toString().padEnd(29)}║
      ║                                                       ║
      ║   Status: RUNNING ✅                                 ║
      ║                                                       ║
      ╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { server };
