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
  Card,
  CardContent,
  Skeleton,
  CardHeader,
  CardTitle,
  When
} from '@trg_package/vite/components';
import { ModuleSelect } from '@trg_package/schemas-dashboard/types';
import { useIsAllowed } from '@/hooks';

interface ICreateDrawerProps {
  module: ModuleSelect['name'];
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
        <DrawerContent className="px-6 pt-6">
          <DrawerHeader className="px-0 hidden">
            <DrawerTitle>Create {module}</DrawerTitle>
          </DrawerHeader>
          <Card className="w-full relative">
            <CardHeader>
              <CardTitle>Create {module}</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton isLoading />}>
                <Component />
              </Suspense>
            </CardContent>
          </Card>
          <DrawerFooter className="px-0">
            <DrawerClose>Cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </When>
  );
};

export default CreateDrawer;
