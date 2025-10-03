import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { LoginCredentials } from '../../types/auth.types';

const loginSchema = yup.object({
  nic: yup
    .string()
    .required('NIC is required')
    .matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/, 'Invalid NIC format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoading(true);
      setError('');
      const response = await authService.login(data);
      setAuth(response.user, response.tokens);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        Login
      </Button>

      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
