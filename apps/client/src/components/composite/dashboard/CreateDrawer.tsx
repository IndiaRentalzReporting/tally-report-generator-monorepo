import React, { Suspense, lazy } from 'react';
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
import { Modules } from '@/models';

interface ICreateDrawerProps {
  module: Modules | undefined;
}
const CreateDrawer: React.FC<ICreateDrawerProps> = ({ module }) => {
  if (!module) return null;

  const Component = lazy(() => import(`../../../views/${module}/Create`));

  return (
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
            fallback={
              <SkeletonOverlay className="w-full h-full absolute z-10" />
            }
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
  );
};

export default CreateDrawer;
