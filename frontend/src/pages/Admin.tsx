import React from 'react';
import Layout from '../components/layout/Layout';
import AdminDashboard from '../components/admin/AdminDashboard';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { UserRole } from '../types/auth.types';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
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
      >
        <AdminDashboard />
      </motion.div>
    </Layout>
  );
};

export default Admin;
