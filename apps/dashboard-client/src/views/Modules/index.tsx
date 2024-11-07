import React from 'react';
import { When } from '@trg_package/vite/components';
import { useIsAllowed } from '@/hooks';
import ReadModule from './Read';

const Modules: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Modules',
    action: 'Read'
  });
  return (
    <When condition={isReadAllowed}>
      <ReadModule />
    </When>
  );
};

export default Modules;
