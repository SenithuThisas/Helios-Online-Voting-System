import React from 'react';
import Layout from '../components/layout/Layout';
import UserList from '../components/admin/UserList';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { UserRole } from '../types/auth.types';
import { Navigate } from 'react-router-dom';

const Users: React.FC = () => {
  const { user } = useAuthStore();

  // Check if user has admin access
  if (!user || (user.role !== UserRole.CHAIRMAN && user.role !== UserRole.SECRETARY)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage organization users and their roles</p>
        </div>

        <UserList />
      </motion.div>
    </Layout>
  );
};

export default Users;
