import React, { Suspense, lazy, useMemo } from 'react';
import {
  Drawer,
  DrawerTrigger,
  Button,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  SkeletonOverlay
} from '@/components/ui';
import { Module } from '@/models';
import { When } from '@/components/utility';
import { useIsAllowed } from '@/lib/hooks';

interface ICreateDrawerProps {
  module: Module['name'];
}
const CreateDrawer: React.FC<ICreateDrawerProps> = ({ module }) => {
  const isCreateAllowed = useIsAllowed({
    module,
    action: 'Create'
  });

  const Component = lazy(() => import(`../../../views/${module}/Create`));

  return (
    <When condition={!!isCreateAllowed}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Create {module}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create {module}</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 h-full">
            <Suspense
              fallback={<SkeletonOverlay className="w-full h-full z-10" />}
            >
              <Component />
            </Suspense>
          </div>

          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </When>
  );
};

export default CreateDrawer;
