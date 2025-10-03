import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { authService } from '../../services/authService';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  onSuccess: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, phone, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.verifyOTP({ phone, code: otp });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      await authService.sendOTP({ phone });
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    setError('');
    setCountdown(60);
    setCanResend(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Verify Phone Number" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          We've sent a 6-digit verification code to {phone}
        </p>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Enter OTP"
          type="text"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        />

        <Button
          type="button"
          variant="primary"
          className="w-full"
          loading={loading}
          onClick={handleVerify}
        >
          Verify
        </Button>

        <div className="text-center text-sm">
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 hover:underline disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          ) : (
            <span className="text-gray-600">Resend OTP in {countdown}s</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OTPModal;
