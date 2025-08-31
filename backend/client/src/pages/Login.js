import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formatRemainingTime } from '../utils/otp';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOTP, resendOTP } = useAuth();
  const [step, setStep] = useState('login'); // 'login' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    nic: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [otpTimestamp, setOtpTimestamp] = useState(null);
  const [remainingTime, setRemainingTime] = useState('03:00');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Countdown timer for OTP
  useEffect(() => {
    let interval;
    if (otpTimestamp && step === 'otp') {
      interval = setInterval(() => {
        const remaining = formatRemainingTime(otpTimestamp);
        setRemainingTime(remaining);
        
        if (remaining === '00:00') {
          setStep('login');
          setErrors({ otp: 'OTP expired. Please login again.' });
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [otpTimestamp, step]);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.nic) newErrors.nic = 'NIC is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await login(formData.email, formData.nic, formData.password);
      setUserId(response.userId);
      setOtpTimestamp(Date.now());
      setStep('otp');
      setErrors({});
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }
    
    setLoading(true);
    try {
      await verifyOTP(userId, otp);
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(userId);
      setOtpTimestamp(Date.now());
      setOtp('');
      setErrors({});
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setOtp('');
    setErrors({});
    setOtpTimestamp(null);
  };

  if (step === 'otp') {
    return (
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '2rem' }}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ textAlign: 'center' }}>
                Verify OTP
              </h2>
            </div>
            
            <form onSubmit={handleOTPVerification}>
              <div className="form-group">
                <label className="form-label">
                  Enter the 6-digit OTP sent to your email
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.otp ? 'error' : ''}`}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                />
                {errors.otp && <div className="form-error">{errors.otp}</div>}
              </div>

              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--background)',
                borderRadius: '0.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Time remaining:
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: remainingTime === '00:00' ? 'var(--error)' : 'var(--primary)'
                }}>
                  {remainingTime}
                </div>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || remainingTime === '00:00'}
                  style={{ width: '100%' }}
                >
                  {loading ? <span className="spinner"></span> : 'Verify OTP'}
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="btn btn-outline"
                  disabled={remainingTime !== '00:00'}
                  style={{ marginRight: '1rem' }}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="btn btn-outline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ textAlign: 'center' }}>
              Welcome Back
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 0 }}>
              Sign in to your Helios Voting account
            </p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">NIC Number</label>
              <input
                type="text"
                name="nic"
                className={`form-input ${errors.nic ? 'error' : ''}`}
                placeholder="Enter your NIC"
                value={formData.nic}
                onChange={handleInputChange}
              />
              {errors.nic && <div className="form-error">{errors.nic}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? <span className="spinner"></span> : 'Sign In'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
