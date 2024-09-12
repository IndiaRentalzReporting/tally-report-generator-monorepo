import React from 'react';
import ReadModule from './Read';
import { When } from '@trg_package/components';
import { useIsAllowed } from '@/lib/hooks';

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
