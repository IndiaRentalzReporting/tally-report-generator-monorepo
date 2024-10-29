import { Edit, Minus } from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Card,
  CardContent,
  Skeleton,
  If,
  Then,
  Else
} from '@trg_package/vite/components';
import { useIsAllowed } from '@/hooks';

interface IUpdateEntityProps {
  size?: number;
  className?: string;
  module: {
    name: string;
    id: string;
    type: string;
  };
}

export const UpdateEntity: React.FC<IUpdateEntityProps> = ({
  module: { id, type },
  className = '',
  size = 20
}) => {
  const isEditAllowed = useIsAllowed({
    module: type,
    action: 'Update'
  });

  const Component = lazy(() => import(`../../../views/${type}/Update`));

  return (
    <If condition={!!isEditAllowed}>
      <Then>
        <Drawer>
          <DrawerTrigger asChild>
            <Edit size={size} className={`text-green-500 ${className}`} />
          </DrawerTrigger>
          <DrawerContent className="px-6">
            <DrawerHeader className="px-0">
              <DrawerTitle>Update {type}</DrawerTitle>
            </DrawerHeader>
            <Card className="w-full relative">
              <CardContent className="pt-6">
                <Suspense fallback={<Skeleton isLoading />}>
                  <Component id={id} />
                </Suspense>
              </CardContent>
            </Card>

            <DrawerFooter className="px-0">
              <DrawerClose>Cancel</DrawerClose>
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
