import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui';

interface IModuleMapperProps {
  module: string;
  action?: string;
}

export const ModuleMapper: React.FC<IModuleMapperProps> = ({
  module,
  action
}) => {
  const Component = lazy(
    () => import(`./${module}${action ? `/${action}` : ''}`)
  );

  return (
    <Suspense fallback={<Skeleton isLoading className="h-full" />}>
      <Component />
    </Suspense>
  );
};
