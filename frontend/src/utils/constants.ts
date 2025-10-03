// Application constants

export const APP_NAME = 'Helios Voting System';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// User roles
export const USER_ROLES = {
  CHAIRMAN: 'CHAIRMAN',
  SECRETARY: 'SECRETARY',
  EXECUTIVE: 'EXECUTIVE',
  VOTER: 'VOTER',
} as const;

// Election status
export const ELECTION_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// Vote status
export const VOTE_STATUS = {
  PENDING: 'PENDING',
  CAST: 'CAST',
  VERIFIED: 'VERIFIED',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',

  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',

  // Elections
  ELECTIONS: '/elections',
  ACTIVE_ELECTIONS: '/elections/active',

  // Votes
  VOTES: '/votes',
  CAST_VOTE: '/votes/cast',

  // Results
  RESULTS: '/results',
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  NIC: /^([0-9]{9}[vVxX]|[0-9]{12})$/,
  PHONE: /^0[0-9]{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  OTP: /^[0-9]{6}$/,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_FULL: 'MMMM DD, YYYY',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Socket events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  ELECTION_CREATED: 'election:created',
  ELECTION_UPDATED: 'election:updated',
  ELECTION_STARTED: 'election:started',
  ELECTION_ENDED: 'election:ended',
  VOTE_CAST: 'vote:cast',
  RESULTS_UPDATED: 'results:updated',
} as const;

// Toast messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_ERROR: 'Login failed',
  REGISTER_SUCCESS: 'Registration successful',
  REGISTER_ERROR: 'Registration failed',
  LOGOUT_SUCCESS: 'Logout successful',
  VOTE_SUCCESS: 'Vote cast successfully',
  VOTE_ERROR: 'Failed to cast vote',
  UPDATE_SUCCESS: 'Updated successfully',
  UPDATE_ERROR: 'Update failed',
  DELETE_SUCCESS: 'Deleted successfully',
  DELETE_ERROR: 'Delete failed',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
} as const;
