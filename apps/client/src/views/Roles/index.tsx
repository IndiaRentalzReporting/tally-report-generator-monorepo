import React from 'react';
import Create from './Create';
import AssignRole from './AssignRole';
import useIsAllowed from '@/lib/hooks/useIsAllowed';
import { When } from '@/components/utility';

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
