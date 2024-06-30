import { Edit, Minus } from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import { If, Then, Else } from '../utility';
import { useIsAllowed } from '@/lib/hooks';
import {
  Drawer,
  DrawerTrigger,
  Button,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  SkeletonOverlay,
  DrawerFooter,
  DrawerClose,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui';

interface IUpdateEntityProps {
  module: string;
  id: string;
}

export const UpdateEntity: React.FC<IUpdateEntityProps> = ({ module, id }) => {
  const isEditAllowed = useIsAllowed({
    module: 'Users',
    action: 'Update'
  });

  const Component = lazy(() => import(`../../views/${module}/Update`));

  return (
    <If condition={!!isEditAllowed}>
      <Then>
        <Drawer>
          <DrawerTrigger asChild>
            <Edit size={20} className="text-green-500" />
          </DrawerTrigger>
          <DrawerContent className="px-6">
            <DrawerHeader className="px-0">
              <DrawerTitle>Update {module}</DrawerTitle>
            </DrawerHeader>
            <Card className="w-full relative">
              <CardContent className="pt-6">
                <Suspense
                  fallback={<SkeletonOverlay className="w-full h-full z-10" />}
                >
                  <Component id={id} />
                </Suspense>
              </CardContent>
            </Card>

            <DrawerFooter className="px-0">
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Then>
      <Else>
        <Minus />
      </Else>
    </If>
  );
};
