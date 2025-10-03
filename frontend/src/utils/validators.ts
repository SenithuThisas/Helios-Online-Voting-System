// Validation utilities

/**
 * Validates Sri Lankan NIC number
 * Supports both old (9 digits + V/X) and new (12 digits) formats
 */
export const validateNIC = (nic: string): boolean => {
  const oldNICPattern = /^[0-9]{9}[vVxX]$/;
  const newNICPattern = /^[0-9]{12}$/;
  return oldNICPattern.test(nic) || newNICPattern.test(nic);
};

/**
 * Validates Sri Lankan mobile phone number
 * Format: 0XXXXXXXXX (10 digits starting with 0)
 */
export const validatePhone = (phone: string): boolean => {
  const phonePattern = /^0[0-9]{9}$/;
  return phonePattern.test(phone);
};

/**
 * Validates email address
 */
export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates password strength
 * At least 6 characters
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates OTP code (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  const otpPattern = /^[0-9]{6}$/;
  return otpPattern.test(otp);
};

/**
 * Get NIC validation error message
 */
export const getNICError = (nic: string): string | null => {
  if (!nic) return 'NIC is required';
  if (!validateNIC(nic)) return 'Invalid NIC format';
  return null;
};

/**
 * Get phone validation error message
 */
export const getPhoneError = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!validatePhone(phone)) return 'Invalid phone number format (e.g., 0712345678)';
  return null;
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | null => {
  if (!email) return null; // Email is optional
  if (!validateEmail(email)) return 'Invalid email format';
  return null;
};

/**
 * Get password validation error message
 */
export const getPasswordError = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (!validatePassword(password)) return 'Password must be at least 6 characters';
  return null;
};
