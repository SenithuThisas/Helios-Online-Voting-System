/**
 * NIC Validator for different countries
 * This is a basic implementation - customize based on your target country
 */

interface NICValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validate Sri Lankan NIC (Old format: 9 digits + V, New format: 12 digits)
 */
const validateSriLankanNIC = (nic: string): NICValidationResult => {
  // Old format: 123456789V or 123456789v
  const oldFormat = /^[0-9]{9}[vVxX]$/;
  // New format: 123456789012
  const newFormat = /^[0-9]{12}$/;

  if (oldFormat.test(nic) || newFormat.test(nic)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'Invalid NIC format. Use 9 digits + V or 12 digits.',
  };
};

/**
 * Validate Indian Aadhaar (12 digits)
 */
const validateIndianAadhaar = (nic: string): NICValidationResult => {
  const aadhaarFormat = /^[0-9]{12}$/;

  if (aadhaarFormat.test(nic)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'Invalid Aadhaar format. Must be 12 digits.',
  };
};

/**
 * Generic NIC validator (at least 9 characters, alphanumeric)
 */
const validateGenericNIC = (nic: string): NICValidationResult => {
  if (nic.length >= 9 && nic.length <= 20) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'NIC must be between 9 and 20 characters.',
  };
};

/**
 * Main NIC validator
 * @param nic - National Identity Card number
 * @param country - Country code (LK, IN, etc.) - defaults to generic
 */
export const validateNIC = (
  nic: string,
  country: string = 'GENERIC'
): NICValidationResult => {
  if (!nic || nic.trim().length === 0) {
    return { isValid: false, message: 'NIC is required' };
  }

  const trimmedNIC = nic.trim();

  switch (country.toUpperCase()) {
    case 'LK':
    case 'SRI_LANKA':
      return validateSriLankanNIC(trimmedNIC);
    case 'IN':
    case 'INDIA':
      return validateIndianAadhaar(trimmedNIC);
    default:
      return validateGenericNIC(trimmedNIC);
  }
};

/**
 * Check if NIC is unique (to be used with database check)
 */
export const isNICUnique = async (
  nic: string,
  checkFunction: (nic: string) => Promise<boolean>
): Promise<boolean> => {
  return checkFunction(nic);
};
