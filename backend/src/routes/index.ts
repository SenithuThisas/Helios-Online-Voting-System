import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import electionRoutes from './election.routes';
import voteRoutes from './vote.routes';
import resultRoutes from './result.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/elections', electionRoutes);
router.use('/votes', voteRoutes);
router.use('/results', resultRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
