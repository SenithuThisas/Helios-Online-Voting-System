import { body } from 'express-validator';
import { VotingType } from '@prisma/client';

export const createElectionValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('votingType')
    .notEmpty()
    .withMessage('Voting type is required')
    .isIn(Object.values(VotingType))
    .withMessage('Invalid voting type'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
  body('candidates')
    .isArray({ min: 2 })
    .withMessage('At least 2 candidates are required'),
  body('candidates.*.name')
    .trim()
    .notEmpty()
    .withMessage('Candidate name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Candidate name must be between 2 and 100 characters'),
  body('candidates.*.description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Candidate description must not exceed 1000 characters'),
  body('candidates.*.photo')
    .optional()
    .trim()
    .isURL()
    .withMessage('Candidate photo must be a valid URL'),
  body('candidates.*.position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a non-negative integer'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
];

export const updateElectionValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('votingType')
    .optional()
    .isIn(Object.values(VotingType))
    .withMessage('Invalid voting type'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object'),
];

export const voteValidator = [
  body('candidateId')
    .trim()
    .notEmpty()
    .withMessage('Candidate ID is required')
    .isUUID()
    .withMessage('Candidate ID must be a valid UUID'),
  body('rank')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Rank must be a positive integer'),
];
