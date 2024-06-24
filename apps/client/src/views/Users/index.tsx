import React from 'react';
import Read from './Read';
import useIsAllowed from '@/lib/hooks/useIsAllowed';
import { When } from '@/components/utility';

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
