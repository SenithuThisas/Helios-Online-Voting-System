import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    nic: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  
  const { login, verifyOTP, resendOTP, loginStep, loginData, resetLoginFlow } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (loginStep === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [loginStep, countdown]);

  // Reset countdown when OTP step starts
  useEffect(() => {
    if (loginStep === 'otp') {
      setCountdown(180);
      setIsResendDisabled(true);
    }
  }, [loginStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.nic) {
      newErrors.nic = 'NIC is required';
    } else if (formData.nic.length < 5 || formData.nic.length > 20) {
      newErrors.nic = 'NIC must be between 5 and 20 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerErrors({});
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Validation failed')) {
        // Handle validation errors from server
        setServerErrors({ general: 'Please check your input and try again' });
      } else {
        setServerErrors({ general: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await verifyOTP(otp);
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ otp: error.message || 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendDisabled(true);
    setCountdown(180);
    try {
      await resendOTP();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrors({ general: error.message || 'Failed to resend OTP' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear server errors when user starts typing
    if (serverErrors.general) {
      setServerErrors({});
    }
  };

  if (loginStep === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="form-container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary">Verify OTP</h2>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit code to {loginData?.email}
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
              {errors.otp && (
                <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Time remaining: <span className="font-semibold text-primary">{formatTime(countdown)}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !otp || otp.length !== 6}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className="text-primary hover:text-primary/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResendDisabled ? `Resend in ${formatTime(countdown)}` : 'Resend OTP'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={resetLoginFlow}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to your Helios account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {serverErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {serverErrors.general}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">
              NIC Number
            </label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your NIC number"
            />
            {errors.nic && (
              <p className="text-red-600 text-sm mt-1">{errors.nic}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

