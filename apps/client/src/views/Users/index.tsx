import React from 'react';
import Read from './Read';
import { When } from '@/components/utility';
import { useIsAllowed } from '@/lib/hooks';

const index: React.FC = () => {
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

export default index;
