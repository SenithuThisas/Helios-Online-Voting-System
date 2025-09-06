import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginStep, setLoginStep] = useState('login'); // 'login', 'otp', 'success'
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      
      // Store login data for OTP verification
      setLoginData({
        userId: response.userId,
        email: credentials.email,
        otp: response.otp, // For development only
        expiresIn: response.expiresIn
      });
      
      setLoginStep('otp');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      if (!loginData) {
        throw new Error('No login session found');
      }

      const response = await api.verifyOTP(loginData.userId, otp);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setCurrentUser(response.user);
      setLoginStep('success');
      setLoginData(null);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendOTP = async () => {
    try {
      if (!loginData) {
        throw new Error('No login session found');
      }

      const response = await api.resendOTP(loginData.userId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if user is logged in
      if (currentUser) {
        await api.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      setCurrentUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setLoginStep('login');
      setLoginData(null);
    }
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const resetLoginFlow = () => {
    setLoginStep('login');
    setLoginData(null);
  };

  const value = {
    currentUser,
    login,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
    loading,
    loginStep,
    loginData,
    resetLoginFlow,
    isAdmin: currentUser?.role === 'admin',
    isExecutive: currentUser?.role === 'executive',
    isVoter: currentUser?.role === 'voter'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
