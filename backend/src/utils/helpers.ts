import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  error: string,
  message: string = 'Error',
  statusCode: number = 500
): void => {
  const response: ApiResponse = {
    success: false,
    error,
    message,
  };
  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200
): void => {
  const totalPages = Math.ceil(total / limit);
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
  res.status(statusCode).json(response);
};

/**
 * Generate a slug from a string
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Calculate pagination offset
 */
export const getPaginationParams = (
  page: number = 1,
  limit: number = 10
): { skip: number; take: number } => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

/**
 * Remove sensitive fields from user object
 */
export const sanitizeUser = <T extends { password?: string }>(user: T): Omit<T, 'password'> => {
  const { password, ...sanitized } = user;
  return sanitized;
};

/**
 * Get client IP address from request
 */
export const getClientIP = (req: any): string => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  return new Date(date) > new Date();
};

/**
 * Check if current time is between two dates
 */
export const isBetweenDates = (startDate: Date, endDate: Date): boolean => {
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
};
