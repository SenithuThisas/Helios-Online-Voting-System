const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('membershipId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Membership ID must be between 3 and 20 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('mobile')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Please provide a valid mobile number (10-15 digits)'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth')
    .custom((value) => {
      const age = Math.floor((Date.now() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        throw new Error('User must be at least 18 years old');
      }
      return true;
    }),
  
  body('address.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  
  body('address.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('address.state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  
  body('address.postalCode')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Postal code must be between 3 and 20 characters'),
  
  body('nic')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('NIC must be between 5 and 20 characters'),
  
  body('division')
    .isIn(['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support'])
    .withMessage('Please select a valid division'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('nic')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('NIC must be between 5 and 20 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for OTP verification
const validateOTP = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  
  handleValidationErrors
];

// Validation rules for voting
const validateVote = [
  body('candidateId')
    .isMongoId()
    .withMessage('Please provide a valid candidate ID'),
  
  handleValidationErrors
];

// Validation rules for election creation
const validateElection = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Election title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Election description must be between 10 and 1000 characters'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('Please provide a valid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('division')
    .isIn(['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support', 'All'])
    .withMessage('Please select a valid division'),
  
  body('maxCandidates')
    .isInt({ min: 2, max: 20 })
    .withMessage('Maximum candidates must be between 2 and 20'),
  
  handleValidationErrors
];

// Validation rules for candidate creation
const validateCandidate = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Candidate name must be between 2 and 100 characters'),
  
  body('membershipId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Membership ID must be between 3 and 20 characters'),
  
  body('division')
    .isIn(['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Engineering', 'Support'])
    .withMessage('Please select a valid division'),
  
  body('position')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),
  
  body('manifesto')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Manifesto must be between 10 and 2000 characters'),
  
  body('experience')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Experience must be between 5 and 500 characters'),
  
  body('election')
    .isMongoId()
    .withMessage('Please provide a valid election ID'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateOTP,
  validateVote,
  validateElection,
  validateCandidate,
  handleValidationErrors
};
