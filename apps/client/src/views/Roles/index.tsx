import React from 'react';
import Create from './Create';
import AssignRole from './AssignRole';
import { When } from '@/components/utility';
import { useIsAllowed } from '@/lib/hooks';

const Roles: React.FC = () => {
  const isReadAllowed = useIsAllowed({
    module: 'Roles',
    action: 'Read'
  });
  return (
    <When condition={isReadAllowed}>
      <Create />
      <AssignRole />
    </When>
  );
};

export default Roles;
