import React from 'react';
import CreateModule from './Create';
import ReadModule from './Read';
import Edit from './Update';

const index: React.FC = () => {
  return (
    <>
      <CreateModule />
      <ReadModule />
    </>
  );
};

export default index;
