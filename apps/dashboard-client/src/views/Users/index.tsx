import React from 'react';
import Read from './Read';
import { When } from '@trg_package/components';
import { useIsAllowed } from '@/lib/hooks';
import AssignRole from './AssignRole';

const Users: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Users',
    action: 'Read'
  });
  const isUpdateAllowed = useIsAllowed({
    module: 'Users',
    action: 'Update'
  });
  return (
    <>
      <When condition={isReadAllowed}>
        <Read />
      </When>
      <When condition={isUpdateAllowed}>
        <AssignRole />
      </When>
    </>
  );
};

export default Users;
