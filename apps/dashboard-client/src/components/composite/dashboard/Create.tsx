import React, { Suspense, lazy } from 'react';
import {
  Drawer,
  DrawerTrigger,
  Button,
  DrawerContent,
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
import { PlusIcon } from 'lucide-react';
import { useIsAllowed } from '@/hooks';

interface ICreateDrawerProps {
  module: ModuleSelect['name'];
}
const Create: React.FC<ICreateDrawerProps> = ({ module }) => {
  const isCreateAllowed = useIsAllowed({
    module,
    action: 'Create'
  });

  const Component = lazy(() => import(`../../../views/${module}/Create`));

  return (
    <When condition={!!isCreateAllowed}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className='flex items-center gap-2'>
            <PlusIcon/>
            Create {module}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-6 pt-6">
          <Card className="w-full relative">
            <CardHeader>
              <CardTitle>
                Create {module}
              </CardTitle>
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

export default Create;
