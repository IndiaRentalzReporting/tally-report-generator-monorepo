import React, { Suspense, lazy } from 'react';
import { SkeletonOverlay } from '@/components/ui';

interface IModuleMapperProps {
  module: string;
}

export const ModuleMapper: React.FC<IModuleMapperProps> = ({ module }) => {
  const Component = lazy(() => import(`./${module}`));

  return (
    <Suspense
      fallback={<SkeletonOverlay className="w-full h-full absolute z-10" />}
    >
      <Component />
    </Suspense>
  );
};
