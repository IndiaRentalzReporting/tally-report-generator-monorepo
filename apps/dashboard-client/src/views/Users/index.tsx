import React from 'react';
import Read from './Read';
import { When } from '@trg_package/components';
import { useIsAllowed } from '@/hooks';

const Users: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Users',
    action: 'Read'
  });
  return (
    <>
      <When condition={isReadAllowed}>
        <Read />
      </When>
    </>
  );
};

export default Users;
