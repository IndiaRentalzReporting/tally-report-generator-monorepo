import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@trg_package/vite/components';
import {
  ActionSelect,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';

interface IModuleMapperProps {
  module: ModuleSelect['name'];
  action?: ActionSelect['name'];
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
