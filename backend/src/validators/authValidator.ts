import { body } from 'express-validator';

export const registerValidator = [
  body('nic')
    .trim()
    .notEmpty()
    .withMessage('NIC is required')
    .isLength({ min: 9, max: 20 })
    .withMessage('NIC must be between 9 and 20 characters'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),
  body('organizationName')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Organization name must be between 3 and 100 characters'),
];

export const loginValidator = [
  body('nic')
    .trim()
    .notEmpty()
    .withMessage('NIC is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

export const requestOTPValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
];

export const verifyOTPValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('OTP code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP code must be 6 digits'),
];

export const refreshTokenValidator = [
  body('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Refresh token is required'),
];
