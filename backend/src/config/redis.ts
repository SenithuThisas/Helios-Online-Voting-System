import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

// Redis Client
export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('error', (err: Error) => {
  logger.error('❌ Redis connection error:', err);
});

redis.on('close', () => {
  logger.warn('⚠️ Redis connection closed');
});

// Redis helper functions
export const redisHelper = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any, expiryInSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (expiryInSeconds) {
        await redis.setex(key, expiryInSeconds, serialized);
      } else {
        await redis.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Redis DELETE error for key ${key}:`, error);
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  },
};

export default redis;
