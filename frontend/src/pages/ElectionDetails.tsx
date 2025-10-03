import React from 'react';
import Layout from '../components/layout/Layout';
import ElectionDetailsComponent from '../components/elections/ElectionDetails';

const ElectionDetails: React.FC = () => {
  return (
    <Layout>
      <ElectionDetailsComponent />
    </Layout>
  );
};

export default ElectionDetails;
