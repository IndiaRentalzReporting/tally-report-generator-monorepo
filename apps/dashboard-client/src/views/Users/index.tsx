import React from 'react';
import { When } from '@trg_package/components';
import Read from './Read';
import { useIsAllowed } from '@/hooks';

const Users: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Users',
    action: 'Read'
  });
  return (
    <When condition={isReadAllowed}>
        <Read />
      </When>
  );
};

export default Users;
