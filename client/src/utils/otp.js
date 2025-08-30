// Format remaining time for OTP countdown
export const formatRemainingTime = (otpTimestamp) => {
  if (!otpTimestamp) return '00:00';
  
  const now = Date.now();
  const otpTime = new Date(otpTimestamp).getTime();
  const threeMinutes = 3 * 60 * 1000;
  const remaining = Math.max(0, threeMinutes - (now - otpTime));
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Check if OTP is expired
export const isOTPExpired = (otpTimestamp) => {
  if (!otpTimestamp) return true;
  
  const now = Date.now();
  const otpTime = new Date(otpTimestamp).getTime();
  const threeMinutes = 3 * 60 * 1000;
  
  return (now - otpTime) > threeMinutes;
};
