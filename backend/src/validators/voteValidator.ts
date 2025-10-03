import { body, param } from 'express-validator';

export const castVoteValidator = [
  param('electionId')
    .trim()
    .notEmpty()
    .withMessage('Election ID is required')
    .isUUID()
    .withMessage('Election ID must be a valid UUID'),
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

export const electionIdValidator = [
  param('electionId')
    .trim()
    .notEmpty()
    .withMessage('Election ID is required')
    .isUUID()
    .withMessage('Election ID must be a valid UUID'),
];
