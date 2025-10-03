import React from 'react';
import Card from '../components/shared/Card';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Helios Voting</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
