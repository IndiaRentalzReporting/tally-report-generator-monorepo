import React from 'react';
import { When } from '@trg_package/vite/components';
import { useIsAllowed } from '@/hooks';
import Read from './Read';

const Roles: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Roles',
    action: 'Read'
  });
  return (
    <When condition={isReadAllowed}>
      <Read />
    </When>
  );
};

export default Roles;
