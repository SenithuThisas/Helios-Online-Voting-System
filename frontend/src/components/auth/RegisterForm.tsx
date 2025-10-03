import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { authService } from '../../services/authService';
import { RegisterData } from '../../types/auth.types';
import OTPModal from './OTPModal';

const registerSchema = yup.object({
  nic: yup
    .string()
    .required('NIC is required')
    .matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/, 'Invalid NIC format'),
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^0[0-9]{9}$/, 'Invalid phone number format (e.g., 0712345678)'),
  email: yup.string().email('Invalid email format').optional(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  organizationName: yup
    .string()
    .required('Organization name is required')
    .min(2, 'Organization name must be at least 2 characters'),
});

type RegisterFormData = RegisterData & { confirmPassword: string };

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError('');

      const registerData: RegisterData = {
        nic: data.nic,
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        organizationName: data.organizationName,
      };

      await authService.register(registerData);
      setPhoneNumber(data.phone);
      setShowOTPModal(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    navigate('/login');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="NIC Number"
          type="text"
          placeholder="Enter your NIC"
          error={errors.nic?.message}
          {...register('nic')}
        />

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Phone Number"
          type="text"
          placeholder="0712345678"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Email (Optional)"
          type="email"
          placeholder="your.email@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Organization Name"
          type="text"
          placeholder="Enter your organization name"
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Register
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Login here
          </button>
        </div>
      </form>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phone={phoneNumber}
        onSuccess={handleOTPSuccess}
      />
    </>
  );
};

export default RegisterForm;
