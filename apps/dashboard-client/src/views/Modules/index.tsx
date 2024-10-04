import React from 'react';
import { When } from '@trg_package/components';
import ReadModule from './Read';
import { useIsAllowed } from '@/hooks';

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
