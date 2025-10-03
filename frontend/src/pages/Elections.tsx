import React from 'react';
import Layout from '../components/layout/Layout';
import ElectionList from '../components/elections/ElectionList';
import { motion } from 'framer-motion';

const Elections: React.FC = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Elections</h1>
          <p className="text-gray-600 mt-1">Browse and participate in active elections</p>
        </div>

        <ElectionList filter="all" showVoteButtons={true} />
      </motion.div>
    </Layout>
  );
};

export default Elections;
