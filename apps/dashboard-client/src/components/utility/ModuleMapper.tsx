import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@trg_package/components';

interface IModuleMapperProps {
  module: string;
  action?: string;
}

export const ModuleMapper: React.FC<IModuleMapperProps> = ({
  module,
  action
}) => {
  const Component = lazy(
    () => import(`../../views/${module}${action ? `/${action}` : ''}`)
  );

  return (
    <Suspense fallback={<Skeleton isLoading className="h-full" />}>
      <Component />
    </Suspense>
  );
};
