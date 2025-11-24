import React from 'react';
import { useParams } from 'react-router-dom';
import EnhancedJournalingView from './EnhancedJournalingView';

const JournalingPage = () => {
  const { mode } = useParams();
  const initialMode = mode || 'current';

  return <EnhancedJournalingView initialMode={initialMode} />;
};

export default JournalingPage;
