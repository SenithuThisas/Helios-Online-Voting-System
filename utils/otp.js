// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if OTP is expired (3 minutes)
const isOTPExpired = (otpTimestamp) => {
  if (!otpTimestamp) return true;
  
  const now = Date.now();
  const otpTime = new Date(otpTimestamp).getTime();
  const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds
  
  return (now - otpTime) > threeMinutes;
};

// Format remaining time for OTP countdown
const formatRemainingTime = (otpTimestamp) => {
  if (!otpTimestamp) return '00:00';
  
  const now = Date.now();
  const otpTime = new Date(otpTimestamp).getTime();
  const threeMinutes = 3 * 60 * 1000;
  const remaining = Math.max(0, threeMinutes - (now - otpTime));
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Validate OTP format
const validateOTPFormat = (otp) => {
  if (!otp) return false;
  if (typeof otp !== 'string') return false;
  if (otp.length !== 6) return false;
  if (!/^\d{6}$/.test(otp)) return false;
  
  return true;
};

module.exports = {
  generateOTP,
  isOTPExpired,
  formatRemainingTime,
  validateOTPFormat
};
