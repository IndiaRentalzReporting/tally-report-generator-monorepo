import { Edit, Minus } from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
  Card,
  CardContent,
  Skeleton,
  If,
  Then,
  Else,
  CardHeader,
  CardTitle
} from '@trg_package/vite/components';
import { useIsAllowed } from '@/hooks';

interface IUpdateEntityProps {
  module: {
    name: string;
    id: string;
    type: string;
  };
}

const Update: React.FC<IUpdateEntityProps> = ({
  module: { id, type },
}) => {
  const isEditAllowed = useIsAllowed({
    module: type,
    action: 'Update'
  });

  const Component = lazy(() => {
    const moduleImports = import.meta.glob<{ default: React.FC<{ id: string }> }>('../../../views/**/Update.tsx');
    const modulePath = `../../../views/${type}/Update.tsx`;

    if (!moduleImports[modulePath]) {
      throw new Error(`Module ${modulePath} not found`);
    }

    return moduleImports[modulePath]().then((module) => module);
  });

  return (
    <If condition={!!isEditAllowed}>
      <Then>
        <Drawer>
          <DrawerTrigger asChild>
            <Edit className="text-green-500" />
          </DrawerTrigger>
          <DrawerContent className="px-6 pt-6">
            <Card className="w-full relative">
              <CardHeader>
                <CardTitle>
                  Update {type}
                </CardTitle>
              </CardHeader>
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
        <Minus/>
      </Else>
    </If>
  );
};

export default Update;
