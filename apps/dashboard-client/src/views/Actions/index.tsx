import React from 'react';
import { When } from '@trg_package/components';
import { useIsAllowed } from '@/hooks';
import Read from './Read';

const Roles: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Actions',
    action: 'Read'
  });

  return (
    <When condition={isReadAllowed}>
      <Read />
    </When>
  );
};

export default Roles;
