import React from 'react';
import ReadModule from './Read';
import useIsAllowed from '@/lib/hooks/useIsAllowed';
import { When } from '@/components/utility';

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
