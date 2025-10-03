import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import routes from './routes';
import { logger } from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Helios Online Voting System API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
